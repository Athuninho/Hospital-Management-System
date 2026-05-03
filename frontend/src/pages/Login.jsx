import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../services/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await auth.login(username, password);
      const user = auth.getUserFromToken();
      // redirect to root which will show role dashboard
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <input className="w-full p-2 border mb-2" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full p-2 border mb-4" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 bg-primary text-white rounded">Login</button>
        <div className="mt-4 text-sm">
          <Link to="/register" className="text-primary underline">Create an account</Link>
        </div>
      </form>
    </div>
  )
}
