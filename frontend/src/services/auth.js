const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch (e) {
    return null;
  }
}

export async function login(username, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  if (data.token) localStorage.setItem('hms_token', data.token);
  return data;
}

export async function register(payload) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}

export function logout() {
  localStorage.removeItem('hms_token');
}

export function getToken() {
  return localStorage.getItem('hms_token');
}

export function getUserFromToken() {
  const t = getToken();
  if (!t) return null;
  const p = parseJwt(t);
  if (!p) return null;
  return { id: p.sub, role: p.role || null };
}

export default { login, register, logout, getToken, getUserFromToken };
