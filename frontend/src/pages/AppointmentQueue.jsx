import React, { useState } from 'react';
import { Calendar, Clock, User, PhoneCall, CheckCircle } from 'lucide-react';

export default function AppointmentQueue() {
  const [appointments] = useState([
    { id: 'APT-100', patient: 'Amina Hassan', type: 'Walk-in', doctor: 'Dr. Omondi', time: '09:00 AM', status: 'waiting' },
    { id: 'APT-101', patient: 'Kiprotich Sang', type: 'Booked', doctor: 'Dr. Wanjiku', time: '09:30 AM', status: 'in-session' },
    { id: 'APT-102', patient: 'Wanjiku Kamau', type: 'Booked', doctor: 'Dr. Omondi', time: '10:00 AM', status: 'scheduled' },
    { id: 'APT-103', patient: 'Otieno James', type: 'Walk-in', doctor: undefined, time: '10:15 AM', status: 'waiting' },
    { id: 'APT-104', patient: 'Lucy Njeri', type: 'Booked', doctor: 'Dr. Omondi', time: '11:00 AM', status: 'scheduled' },
  ]);

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Appointment Queue & Calendar</h1>
          <p className="text-slate-500">Manage today's doctor schedules and patient queues.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md transition-colors font-medium">
          <Calendar size={18} />
          Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex justify-between items-center">
              <span>Today's Queue</span>
              <span className="text-primary text-sm font-medium">{appointments.length} Patients Total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {appointments.map(apt => (
                <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{apt.patient}</h4>
                      <div className="flex gap-3 text-sm font-medium mt-1">
                         <span className="text-slate-500 flex items-center gap-1"><Clock size={14} /> {apt.time}</span>
                         <span className={`px-2 py-0.5 rounded ${apt.type === 'Walk-in' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-600'}`}>{apt.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700 mb-1">{apt.doctor || 'Unassigned'}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${apt.status === 'in-session' ? 'bg-green-100 text-green-700' : 
                        apt.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-blue-100 text-blue-700'}`}>
                      {apt.status === 'in-session' ? 'In Session' : apt.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl rounded-tr-none shadow-sm border border-slate-100 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full pointer-events-none"></div>
             <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
             <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-blue-50/50 transition-colors mb-3">
               <span className="font-medium text-slate-700">Assign Doctor</span>
               <User size={18} className="text-primary" />
             </button>
             <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-success hover:bg-green-50/50 transition-colors mb-3">
               <span className="font-medium text-slate-700">Mark Completed</span>
               <CheckCircle size={18} className="text-success" />
             </button>
             <button className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50/50 transition-colors">
               <span className="font-medium text-slate-700">Call Patient</span>
               <PhoneCall size={18} className="text-orange-500" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
