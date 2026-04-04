import React from 'react';
import { UserPlus } from 'lucide-react';

export default function PatientRegistration() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Patient Registration</h1>
          <p className="text-slate-500">Add a new patient to the EMR system.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Enter first name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Enter last name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">National ID</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="e.g. 12345678" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">NHIF Number</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Enter NHIF number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
              <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="07XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Emergency Contact (Next of Kin)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Next of kin name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Contact number" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg shadow-blue-500/30 transition-all font-medium text-lg">
              <UserPlus size={20} />
              Register Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
