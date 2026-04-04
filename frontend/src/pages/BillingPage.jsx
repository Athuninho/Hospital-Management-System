import React, { useState } from 'react'
import api from '../services/api'

export default function BillingPage(){
  const [visitId, setVisitId] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [msg, setMsg] = useState('');

  const compute = async ()=>{
    try{
      const token = localStorage.getItem('token');
      const res = await api.post(`/billing/compute/${visitId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setInvoice(res.data.invoice);
    }catch(err){ setMsg('Error computing invoice') }
  }

  const payCash = async ()=>{
    try{
      const token = localStorage.getItem('token');
      await api.post('/billing/pay', { invoiceId: invoice.id, amount: invoice.patient_balance, method: 'cash' }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('Payment recorded');
    }catch(err){ setMsg('Payment error') }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Billing</h2>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 flex-1" value={visitId} onChange={e=>setVisitId(e.target.value)} placeholder="Visit ID" />
        <button onClick={compute} className="bg-green-600 text-white px-3 py-2 rounded">Compute</button>
      </div>
      {invoice && (
        <div>
          <p>Total: KES {invoice.total_amount}</p>
          <p>NHIF Covered: KES {invoice.nhif_covered_amount}</p>
          <p>Patient Balance: KES {invoice.patient_balance}</p>
          <div className="mt-3">
            <button onClick={payCash} className="bg-blue-600 text-white px-3 py-2 rounded">Pay Cash</button>
          </div>
        </div>
      )}
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  )
}
