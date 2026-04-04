import React, { useState } from 'react';
import { TestTube, Plus, FileText, CheckCircle } from 'lucide-react';

export default function Laboratory() {
  const [requests] = useState([
    { id: 'REQ-401', patient: 'John Doe', tests: ['Complete Blood Count', 'Malaria Smear'], status: 'pending', date: '2026-04-04 10:30 AM' },
    { id: 'REQ-402', patient: 'Jane Smith', tests: ['Liver Function Test'], status: 'completed', date: '2026-04-04 11:15 AM' },
    { id: 'REQ-403', patient: 'Kiprono Peter', tests: ['Urinalysis'], status: 'pending', date: '2026-04-04 12:00 PM' }
  ]);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Laboratory</h1>
          <p className="text-slate-500">Manage lab test requests and enter results.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-colors font-medium">
          <Plus size={18} />
          New Request
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 text-sm">
            <tr>
              <th className="p-4 font-semibold">Request ID</th>
              <th className="p-4 font-semibold">Patient</th>
              <th className="p-4 font-semibold">Tests Requested</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-600">{req.id}</td>
                <td className="p-4 font-bold text-slate-800">{req.patient}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {req.tests.map((t, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-slate-500 text-sm">{req.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {req.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {req.status === 'pending' ? (
                     <button className="p-2 text-white bg-primary hover:bg-blue-600 transition-colors rounded-lg flex items-center gap-1 text-sm font-medium">
                       <TestTube size={16} /> Enter Results
                     </button>
                  ) : (
                     <button className="p-2 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 text-sm font-medium">
                       <FileText size={16} /> View Report
                     </button>
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
