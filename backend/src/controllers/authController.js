const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

async function register(req, res) {
  const { username, password, full_name, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username_password_required' });
  const hash = await bcrypt.hash(password, 12);

  // resolve role name to role_id; create role if missing
  let roleId = null;
  if (role) {
    // accept either role name or role id; try to find by name first
    const r = await db.query('SELECT id FROM roles WHERE name=$1', [role]);
    if (r.rows.length) {
      roleId = r.rows[0].id;
    } else {
      const ins = await db.query('INSERT INTO roles (name) VALUES ($1) RETURNING id', [role]);
      roleId = ins.rows[0].id;
    }
  }

  const result = await db.query(
    'INSERT INTO users (username, password_hash, full_name, role_id) VALUES ($1,$2,$3,$4) RETURNING id, username, full_name, role_id',
    [username, hash, full_name, roleId]
  );

  // include role name in response
  let roleName = null;
  if (roleId) {
    const rr = await db.query('SELECT name FROM roles WHERE id=$1', [roleId]);
    if (rr.rows.length) roleName = rr.rows[0].name;
  }

  res.json({ user: { ...result.rows[0], role: roleName } });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username_password_required' });
  // include role name via join
  const r = await db.query(
    'SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.username=$1',
    [username]
  );
  if (!r.rows.length) return res.status(401).json({ error: 'invalid_credentials' });
  const user = r.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role_name || null }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role_name || null } });
}

module.exports = { register, login };
