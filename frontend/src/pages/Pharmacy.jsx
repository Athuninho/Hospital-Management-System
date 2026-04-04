import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Pharmacy(){
  const [drugs, setDrugs] = useState([])
  const [form, setForm] = useState({ name:'', generic_name:'', unit:'tab', price_kes:'', stock:0, expiry_date:'' })
  const [dispenseItems, setDispenseItems] = useState([{ drug_id:'', quantity:1 }])
  const [visitId, setVisitId] = useState('')
  const [msg, setMsg] = useState('')

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
      setMsg('Added: ' + res.data.drug.name)
      setForm({ name:'', generic_name:'', unit:'tab', price_kes:'', stock:0, expiry_date:'' })
      fetchDrugs()
    }catch(err){ setMsg('Add error') }
  }

  const updateDispenseItem = (i, k, v) => {
    const copy = [...dispenseItems]; copy[i][k]=v; setDispenseItems(copy)
  }

  const addDispenseRow = ()=> setDispenseItems([...dispenseItems, { drug_id:'', quantity:1 }])

  const doDispense = async ()=>{
    // client-side validation
    if (!dispenseItems.length) return setMsg('No items to dispense')
    for (const it of dispenseItems) {
      if (!it.drug_id) return setMsg('Select drug for all rows')
      if (!it.quantity || it.quantity <= 0) return setMsg('Quantity must be > 0')
    }
    if (!confirm('Confirm dispense and bill to visit (if Visit ID provided)?')) return
    try{
      const payload = { items: dispenseItems, visit_id: visitId || undefined }
      await api.post('/pharmacy/dispense', payload, { headers: { Authorization: `Bearer ${token}` } })
      setMsg('Dispensed successfully')
      setDispenseItems([{ drug_id:'', quantity:1 }])
      setVisitId('')
      fetchDrugs()
    }catch(err){ setMsg('Dispense failed: '+(err.response?.data?.message||err.message)) }
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
        <div className="mb-2">
          <label className="block text-sm mb-1">Bill to Visit ID (optional)</label>
          <input value={visitId} onChange={e=>setVisitId(e.target.value)} placeholder="Visit ID" className="border p-2 w-1/3" />
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
          <button onClick={addDispenseRow} className="px-3 py-1 border rounded">Add row</button>
          <button onClick={doDispense} className="px-3 py-1 bg-green-600 text-white rounded">Dispense</button>
        </div>
      </section>

      {msg && <div className="p-3 bg-yellow-100 rounded">{msg}</div>}
    </div>
  )
}
