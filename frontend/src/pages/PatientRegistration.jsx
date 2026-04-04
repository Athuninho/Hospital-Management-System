import React, { useState } from 'react'
import api from '../services/api'

export default function PatientRegistration(){
  const [form, setForm] = useState({ first_name:'', last_name:'', national_id:'', phone:'', nhif_number:'', next_of_kin: '' });
  const [msg, setMsg] = useState('');
  const onChange = e => setForm({...form, [e.target.name]: e.target.value});
  const submit = async (e)=>{
    e.preventDefault();
    try{
      const payload = { ...form, next_of_kin: { name: form.next_of_kin } };
      const token = localStorage.getItem('token');
      const res = await api.post('/patients', payload, { headers: { Authorization: `Bearer ${token}` } });
      setMsg('Patient created: ' + res.data.patient.id);
    }catch(err){ setMsg('Error: ' + (err.response?.data?.error||err.message)) }
  }
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register Patient</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label>First name</label>
          <input name="first_name" value={form.first_name} onChange={onChange} className="w-full border p-2" />
        </div>
        <div>
          <label>Last name</label>
          <input name="last_name" value={form.last_name} onChange={onChange} className="w-full border p-2" />
        </div>
        <div>
          <label>National ID</label>
          <input name="national_id" value={form.national_id} onChange={onChange} className="w-full border p-2" />
        </div>
        <div>
          <label>Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="w-full border p-2" />
        </div>
        <div>
          <label>NHIF Number</label>
          <input name="nhif_number" value={form.nhif_number} onChange={onChange} className="w-full border p-2" />
        </div>
        <div>
          <label>Next of kin (name)</label>
          <input name="next_of_kin" value={form.next_of_kin} onChange={onChange} className="w-full border p-2" />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
      {msg && <p className="mt-3">{msg}</p>}
    </div>
  )
}
