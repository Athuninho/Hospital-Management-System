import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Lab(){
  const [tests, setTests] = useState([])
  const [testForm, setTestForm] = useState({ code:'', name:'', description:'', price_kes:0 })
  const [requestForm, setRequestForm] = useState({ visit_id:'', test_ids:[] })
  const [results, setResults] = useState([])
  const [msg, setMsg] = useState('')
  const token = localStorage.getItem('token')

  useEffect(()=>{ fetchTests() }, [])

  async function fetchTests(){
    try{ const r = await api.get('/lab/tests', { headers: { Authorization: `Bearer ${token}` } }); setTests(r.data.tests) }catch(e){console.error(e)}
  }

  const addTest = async (e)=>{
    e.preventDefault();
    try{ await api.post('/lab/tests', testForm, { headers:{ Authorization:`Bearer ${token}` } }); setMsg('Test added'); setTestForm({ code:'', name:'', description:'', price_kes:0}); fetchTests() }catch(err){ setMsg('Add failed') }
  }

  const createRequests = async ()=>{
    try{
      const payload = { visit_id: requestForm.visit_id, test_ids: requestForm.test_ids }
      await api.post('/lab/requests', payload, { headers:{ Authorization:`Bearer ${token}` } })
      setMsg('Requests created')
    }catch(err){ setMsg('Create requests failed') }
  }

  const fetchResults = async () => {
    if (!requestForm.visit_id) return setMsg('Enter visit id')
    try{
      const r = await api.get(`/lab/results/visit/${requestForm.visit_id}`, { headers:{ Authorization:`Bearer ${token}` } })
      setResults(r.data.results)
    }catch(err){ setMsg('Fetch results error') }
  }

  const enterResult = async (requestId, test_id) => {
    const value = prompt('Enter result (free text)')
    if (!value) return
    try{
      await api.post(`/lab/results/${requestId}`, { test_id, result: value }, { headers:{ Authorization:`Bearer ${token}` } })
      setMsg('Result saved')
      fetchResults()
    }catch(err){ setMsg('Save failed') }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Add Lab Test</h3>
        <form className="grid grid-cols-2 gap-3 mt-3" onSubmit={addTest}>
          <input placeholder="Code" value={testForm.code} onChange={e=>setTestForm({...testForm, code:e.target.value})} className="border p-2" />
          <input placeholder="Name" value={testForm.name} onChange={e=>setTestForm({...testForm, name:e.target.value})} className="border p-2" />
          <input placeholder="Price KES" type="number" value={testForm.price_kes} onChange={e=>setTestForm({...testForm, price_kes:Number(e.target.value)})} className="border p-2" />
          <input placeholder="Description" value={testForm.description} onChange={e=>setTestForm({...testForm, description:e.target.value})} className="border p-2" />
          <div className="col-span-2"><button className="bg-blue-600 text-white px-3 py-2 rounded">Add Test</button></div>
        </form>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Create Test Requests</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input placeholder="Visit ID" value={requestForm.visit_id} onChange={e=>setRequestForm({...requestForm, visit_id:e.target.value})} className="border p-2" />
          <div />
          <div className="col-span-2">
            <label className="block mb-1">Select tests</label>
            <div className="grid grid-cols-2 gap-2">
              {tests.map(t=> (
                <label key={t.id} className="border p-2">
                  <input type="checkbox" value={t.id} onChange={e=>{
                    const id=t.id; const checked=e.target.checked; const set=new Set(requestForm.test_ids);
                    if (checked) set.add(id); else set.delete(id);
                    setRequestForm({...requestForm, test_ids: Array.from(set)})
                  }} /> {t.name} (KES {t.price_kes})
                </label>
              ))}
            </div>
          </div>
          <div className="col-span-2 flex gap-2">
            <button onClick={createRequests} className="bg-green-600 text-white px-3 py-2 rounded">Create Requests</button>
            <button onClick={fetchResults} className="px-3 py-2 border rounded">Fetch Results</button>
          </div>
        </div>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Results for Visit</h3>
        <div className="mt-3">
          {results.map(r=> (
            <div key={r.request_id + '-' + r.test_id} className="border-b py-2 flex justify-between">
              <div>
                <div className="font-medium">{r.test_name}</div>
                <div className="text-sm text-gray-600">Result: {r.result || '—'}</div>
              </div>
              <div>
                <button onClick={()=>enterResult(r.request_id, r.test_id)} className="px-2 py-1 bg-blue-600 text-white rounded">Enter Result</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {msg && <div className="p-3 bg-yellow-100 rounded">{msg}</div>}
    </div>
  )
}
