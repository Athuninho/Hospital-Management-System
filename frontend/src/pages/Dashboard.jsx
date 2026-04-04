import React from 'react';
import { Users, Activity, CreditCard, Stethoscope } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Total Patients', value: '1,240', icon: <Users size={24} className="text-primary"/>, bg: 'bg-blue-100' },
    { title: 'Today\'s Admissions', value: '42', icon: <Activity size={24} className="text-success"/>, bg: 'bg-green-100' },
    { title: 'Revenue (KES)', value: '254K', icon: <CreditCard size={24} className="text-warning"/>, bg: 'bg-yellow-100' },
    { title: 'Active Doctors', value: '18', icon: <Stethoscope size={24} className="text-purple-500"/>, bg: 'bg-purple-100' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Hospital Dashboard</h1>
      <p className="text-slate-500 mb-8">Overview of the facility's operations for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Patient Output Chart</h3>
           <div className="flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <p className="text-slate-400">Chart rendering (Chart.js / Recharts)</p>
           </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Admissions</h3>
           <div className="space-y-4">
             {[1,2,3,4].map(num => (
               <div key={num} className="flex gap-3 items-center border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">P{num}</div>
                 <div>
                   <p className="text-sm font-semibold text-slate-800">John Doe {num}</p>
                   <p className="text-xs text-slate-500">Ward A - Bed {num*2}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
