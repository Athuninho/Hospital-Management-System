const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

async function register(req, res) {
  const { username, password, full_name, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username_password_required' });
  const hash = await bcrypt.hash(password, 12);
  const result = await db.query(
    'INSERT INTO users (username, password_hash, full_name) VALUES ($1,$2,$3) RETURNING id, username, full_name',
    [username, hash, full_name]
  );
  res.json({ user: result.rows[0] });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username_password_required' });
  const r = await db.query('SELECT * FROM users WHERE username=$1', [username]);
  if (!r.rows.length) return res.status(401).json({ error: 'invalid_credentials' });
  const user = r.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name } });
}

module.exports = { register, login };
