import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('reception');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { register, loading } = useAuth();

  async function submit(e) {
    e.preventDefault();
    try {
      await register({ username, password, full_name: fullName, role });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Register failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <input className="w-full p-2 border mb-2" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full p-2 border mb-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <label className="text-sm mb-2 block">Role</label>
        <select className="w-full p-2 border mb-4" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="reception">Reception</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="lab">Lab</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="billing">Billing</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={loading} className="w-full py-2 bg-primary text-white rounded">{loading ? 'Creating account...' : 'Register'}</button>
        <div className="mt-4 text-sm">
          <Link to="/login" className="text-primary underline">Already have an account?</Link>
        </div>
      </form>
    </div>
  )
}
