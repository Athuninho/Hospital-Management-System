import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Pharmacy(){
  const [drugs, setDrugs] = useState([])
  const [form, setForm] = useState({ name:'', generic_name:'', unit:'tab', price_kes:'', stock:0, expiry_date:'' })
  const [dispenseItems, setDispenseItems] = useState([{ drug_id:'', quantity:1 }])
  const [visitId, setVisitId] = useState('')
  const [prescriptionId, setPrescriptionId] = useState('')
  const [msg, setMsg] = useState('')
  const [toast, setToast] = useState({ message:'', type:'info' })
  const [showConfirm, setShowConfirm] = useState(false)

  const token = localStorage.getItem('token')

  useEffect(()=>{ fetchDrugs() }, [])

  async function fetchDrugs(){
    try{
      const res = await api.get('/pharmacy/drugs', { headers: { Authorization: `Bearer ${token}` } })
      setDrugs(res.data.drugs)
    }catch(err){ console.error(err) }
  }

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value})

  const addDrug = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post('/pharmacy/drugs', form, { headers: { Authorization: `Bearer ${token}` } })
      setToast({ message: 'Added: ' + res.data.drug.name, type: 'success' })
      setForm({ name:'', generic_name:'', unit:'tab', price_kes:'', stock:0, expiry_date:'' })
      fetchDrugs()
    }catch(err){ setToast({ message: 'Add error', type: 'error' }) }
  }

  const updateDispenseItem = (i, k, v) => {
    const copy = [...dispenseItems]; copy[i][k]=v; setDispenseItems(copy)
  }

  const addDispenseRow = ()=> setDispenseItems([...dispenseItems, { drug_id:'', quantity:1 }])

  const confirmDispense = ()=>{
    if (!dispenseItems.length) return setToast({ message: 'No items to dispense', type: 'error' })
    for (const it of dispenseItems) {
      if (!it.drug_id) return setToast({ message: 'Select drug for all rows', type: 'error' })
      if (!it.quantity || it.quantity <= 0) return setToast({ message: 'Quantity must be > 0', type: 'error' })
    }
    setShowConfirm(true)
  }

  const doDispense = async ()=>{
    setShowConfirm(false)
    try{
      const payload = { items: dispenseItems, visit_id: visitId || undefined, prescription_id: prescriptionId || undefined }
      await api.post('/pharmacy/dispense', payload, { headers: { Authorization: `Bearer ${token}` } })
      setToast({ message: 'Dispensed successfully', type: 'success' })
      setDispenseItems([{ drug_id:'', quantity:1 }])
      setVisitId('')
      setPrescriptionId('')
      fetchDrugs()
    }catch(err){ setToast({ message: 'Dispense failed: '+(err.response?.data?.message||err.message), type: 'error' }) }
  }

  const loadFromPrescription = async ()=>{
    if (!prescriptionId) return setToast({ message: 'Enter prescription id', type: 'error' })
    try{
      const r = await api.get(`/pharmacy/prescription/${prescriptionId}`, { headers: { Authorization: `Bearer ${token}` } })
      const items = r.data.items.map(it => ({ drug_id: it.drug_id, quantity: it.quantity }))
      setDispenseItems(items)
      setToast({ message: 'Loaded prescription', type:'success' })
    }catch(err){ setToast({ message: 'Load failed', type:'error' }) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Add Drug</h3>
        <form className="grid grid-cols-2 gap-3 mt-3" onSubmit={addDrug}>
          <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="border p-2" />
          <input name="generic_name" value={form.generic_name} onChange={onChange} placeholder="Generic" className="border p-2" />
          <input name="unit" value={form.unit} onChange={onChange} placeholder="Unit" className="border p-2" />
          <input name="price_kes" value={form.price_kes} onChange={onChange} placeholder="Price KES" className="border p-2" />
          <input name="stock" value={form.stock} onChange={onChange} placeholder="Stock" type="number" className="border p-2" />
          <input name="expiry_date" value={form.expiry_date} onChange={onChange} placeholder="Expiry YYYY-MM-DD" className="border p-2" />
          <div className="col-span-2"><button className="bg-blue-600 text-white px-3 py-2 rounded">Add Drug</button></div>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Inventory</h3>
        <table className="w-full mt-3 table-auto text-left">
          <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Expiry</th></tr></thead>
          <tbody>
            {drugs.map(d=> (
              <tr key={d.id} className="border-t"><td>{d.name}</td><td>KES {d.price_kes}</td><td>{d.stock}</td><td>{d.expiry_date || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Dispense</h3>
        <div className="mb-2 grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm mb-1">Bill to Visit ID (optional)</label>
            <input value={visitId} onChange={e=>setVisitId(e.target.value)} placeholder="Visit ID" className="border p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm mb-1">Load from Prescription</label>
            <div className="flex gap-2">
              <input value={prescriptionId} onChange={e=>setPrescriptionId(e.target.value)} placeholder="Prescription ID" className="border p-2 flex-1" />
              <button type="button" onClick={loadFromPrescription} className="px-3 py-1 bg-indigo-600 text-white rounded">Load</button>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <button type="button" onClick={()=>setDispenseItems([{ drug_id:'', quantity:1 }])} className="px-3 py-1 border rounded">Clear</button>
          </div>
        </div>
        {dispenseItems.map((it,i)=> (
          <div key={i} className="flex gap-2 items-center mt-2">
            <select value={it.drug_id} onChange={e=>updateDispenseItem(i,'drug_id',e.target.value)} className="border p-2 flex-1">
              <option value="">Select drug</option>
              {drugs.map(d=> <option key={d.id} value={d.id}>{d.name} (stock {d.stock})</option>)}
            </select>
            <input type="number" value={it.quantity} onChange={e=>updateDispenseItem(i,'quantity',Number(e.target.value))} className="w-24 border p-2" />
          </div>
        ))}
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={addDispenseRow} className="px-3 py-1 border rounded">Add row</button>
          <button type="button" onClick={confirmDispense} className="px-3 py-1 bg-green-600 text-white rounded">Dispense</button>
        </div>
      </section>

      {msg && <div className="p-3 bg-yellow-100 rounded">{msg}</div>}

      <Modal show={showConfirm} title="Confirm Dispense" onCancel={()=>setShowConfirm(false)} onConfirm={doDispense}>
        <div>Confirm dispensing {dispenseItems.length} item(s) and bill to visit {visitId || 'N/A'}?</div>
      </Modal>

      <Toast message={toast.message} type={toast.type} onClose={()=>setToast({message:'',type:'info'})} />
    </div>
  )
}
