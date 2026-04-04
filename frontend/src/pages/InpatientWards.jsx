import React, { useState } from 'react';
import { BedDouble, Users, UserPlus } from 'lucide-react';

export default function InpatientWards() {
  const [wards] = useState([
    { id: 'W-01', name: 'General Ward A (Male)', capacity: 20, occupied: 15 },
    { id: 'W-02', name: 'General Ward B (Female)', capacity: 20, occupied: 18 },
    { id: 'W-03', name: 'Maternity Ward', capacity: 15, occupied: 10 },
    { id: 'W-04', name: 'ICU', capacity: 5, occupied: 5, critical: true }
  ]);

  const [selectedWard, setSelectedWard] = useState(wards[0].id);

  // Simulated beds for selected ward
  const beds = Array.from({length: 20}, (_, i) => ({
    id: `B-${i+1}`,
    number: i+1,
    occupied: i < wards.find(w => w.id === selectedWard).occupied,
    patientName: i < wards.find(w => w.id === selectedWard).occupied ? `Patient ${i+1}` : null
  }));

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Inpatient Wards</h1>
          <p className="text-slate-500">Track current admissions, assign beds, and oversee capacity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Ward List</h3>
          {wards.map(w => (
            <div 
              key={w.id} 
              onClick={() => setSelectedWard(w.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedWard === w.id ? 'border-primary ring-2 ring-primary/20 bg-blue-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <h4 className="font-bold text-slate-800 flex items-center justify-between">
                {w.name}
                {w.critical && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs">Full</span>}
              </h4>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <Users size={14} />
                <span>{w.occupied} / {w.capacity} Beds</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 mt-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${w.occupied / w.capacity > 0.8 ? 'bg-danger' : 'bg-success'}`} 
                  style={{ width: `${(w.occupied / w.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-slate-800">{wards.find(w => w.id === selectedWard).name} - Bed Layout</h3>
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
              <UserPlus size={16} /> Admit Patient
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {beds.slice(0, wards.find(w => w.id === selectedWard).capacity).map(bed => (
              <div key={bed.id} className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${bed.occupied ? 'border-slate-200 bg-slate-50' : 'border-dashed border-success/50 bg-green-50/30 cursor-pointer hover:border-success'}`}>
                <BedDouble size={24} className={bed.occupied ? 'text-slate-400' : 'text-success'} />
                <span className="font-bold text-sm text-slate-700">Bed {bed.number}</span>
                {bed.occupied ? (
                  <span className="text-xs text-center text-slate-500 font-medium truncate w-full">{bed.patientName}</span>
                ) : (
                  <span className="text-xs text-center text-success font-medium">Available</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
