// Simple seeding script for default roles
require('dotenv').config();
const db = require('../..//src/db');

const roles = [
  { name: 'admin', description: 'System administrator with full access' },
  { name: 'doctor', description: 'Medical doctor / clinician' },
  { name: 'nurse', description: 'Nursing staff' },
  { name: 'lab', description: 'Laboratory staff' },
  { name: 'pharmacy', description: 'Pharmacy staff' },
  { name: 'billing', description: 'Billing and payments' },
  { name: 'reception', description: 'Front desk / reception' }
];

async function seed() {
  try {
    for (const r of roles) {
      const res = await db.query(
        `INSERT INTO roles (name, description) VALUES ($1,$2) ON CONFLICT (name) DO NOTHING RETURNING id`,
        [r.name, r.description]
      );
      if (res.rows.length) {
        console.log('Inserted role:', r.name, res.rows[0].id);
      } else {
        console.log('Role exists, skipped:', r.name);
      }
    }
  } catch (err) {
    console.error('Seeding roles failed:', err.message || err);
  } finally {
    try { await db.pool.end(); } catch (e) {}
  }
}

seed();
