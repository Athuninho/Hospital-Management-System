import React, { useState } from 'react';
import { PackageSearch, AlertTriangle } from 'lucide-react';

export default function PharmacyStock() {
  const [stock] = useState([
    { id: 'DRG-001', name: 'Paracetamol 500mg', generic: 'Acetaminophen', stock: 1500, price: 10, expiry: '2027-04-12' },
    { id: 'DRG-002', name: 'Amoxicillin 250mg', generic: 'Amoxicillin', stock: 45, price: 50, expiry: '2026-08-20' },
    { id: 'DRG-003', name: 'Artemether-Lumefantrine', generic: 'AL', stock: 210, price: 150, expiry: '2026-11-01' },
    { id: 'DRG-004', name: 'Ceftriaxone 1g Injection', generic: 'Ceftriaxone', stock: 12, price: 400, expiry: '2025-01-10' },
  ]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Pharmacy Inventory</h1>
          <p className="text-slate-500">Track medication stock, expiry dates, and pricing.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-colors font-medium">
          <PackageSearch size={18} />
          Receive Stock
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 text-sm">
            <tr>
              <th className="p-4 font-semibold">SKU</th>
              <th className="p-4 font-semibold">Drug Name</th>
              <th className="p-4 font-semibold">Generic Name</th>
              <th className="p-4 font-semibold">Price (KES)</th>
              <th className="p-4 font-semibold">Stock Level</th>
              <th className="p-4 font-semibold">Expiry Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stock.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-500 font-medium">{item.id}</td>
                <td className="p-4 font-bold text-slate-800">{item.name}</td>
                <td className="p-4 text-slate-600">{item.generic}</td>
                <td className="p-4 font-semibold">KES {item.price}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${item.stock < 50 ? 'text-danger' : 'text-slate-800'}`}>
                      {item.stock} units
                    </span>
                    {item.stock < 50 && <AlertTriangle size={16} className="text-danger" />}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${new Date(item.expiry) < new Date() ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                    {item.expiry}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
