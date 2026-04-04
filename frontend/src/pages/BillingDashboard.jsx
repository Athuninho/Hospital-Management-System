import React, { useState } from 'react';
import { FileText, ShieldCheck, Phone } from 'lucide-react';

export default function BillingDashboard() {
  const [invoices] = useState([
    { id: 'INV-1029', patient: 'Amina Hassan', total: 4500, nhif: 0, balance: 4500, status: 'pending' },
    { id: 'INV-1030', patient: 'Kiprotich Sang', total: 12000, nhif: 8000, balance: 4000, status: 'nhif_claim' },
    { id: 'INV-1031', patient: 'Wanjiku Kamau', total: 2500, nhif: 0, balance: 2500, status: 'paid' },
  ]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Billing & NHIF Claims</h1>
          <p className="text-slate-500">Manage patient invoices, cash payments, and M-Pesa integrations.</p>
        </div>
        <button className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-colors font-medium">
          New Invoice
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 text-sm">
            <tr>
              <th className="p-4 font-semibold">Invoice #</th>
              <th className="p-4 font-semibold">Patient Name</th>
              <th className="p-4 font-semibold">Total (KES)</th>
              <th className="p-4 font-semibold">NHIF Cover</th>
              <th className="p-4 font-semibold">Balance</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-primary font-medium">{inv.id}</td>
                <td className="p-4 text-slate-800 font-medium">{inv.patient}</td>
                <td className="p-4">KES {inv.total.toLocaleString()}</td>
                <td className="p-4 text-success font-medium">KES {inv.nhif.toLocaleString()}</td>
                <td className="p-4 font-bold text-slate-800">KES {inv.balance.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 
                      inv.status === 'nhif_claim' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'}`}>
                    {inv.status.toUpperCase().replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  {inv.status !== 'paid' && (
                    <div className="flex gap-2">
                       <button className="p-2 bg-success text-white rounded-lg hover:bg-green-600 transition-colors" title="M-Pesa STK Push">
                         <Phone size={16} />
                       </button>
                       <button className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors" title="Apply NHIF">
                         <ShieldCheck size={16} />
                       </button>
                    </div>
                  )}
                  {inv.status === 'paid' && (
                    <a 
                      href={`http://localhost:4000/api/billing/download/${inv.id.replace('INV-', '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-800 transition-colors inline-block" 
                      title="View Receipt"
                    >
                      <FileText size={16} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
