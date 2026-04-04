const db = require('../db');

async function addDrug(req, res) {
  try {
    const { name, generic_name, unit, price_kes, stock, expiry_date } = req.body;
    if (!name || price_kes == null) return res.status(400).json({ error: 'missing_fields' });
    const r = await db.query(
      `INSERT INTO drugs (name, generic_name, unit, price_kes, stock, expiry_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, generic_name || null, unit || null, price_kes, stock || 0, expiry_date || null]
    );
    res.json({ drug: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create_failed' });
  }
}

async function updateDrug(req, res) {
  try {
    const id = req.params.id;
    const fields = req.body;
    const keys = Object.keys(fields);
    if (!keys.length) return res.status(400).json({ error: 'no_fields' });
    const sets = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
    const vals = keys.map(k => fields[k]);
    vals.push(id);
    const q = `UPDATE drugs SET ${sets} WHERE id=$${keys.length + 1} RETURNING *`;
    const r = await db.query(q, vals);
    res.json({ drug: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'update_failed' });
  }
}

async function listDrugs(req, res) {
  try {
    const r = await db.query('SELECT * FROM drugs ORDER BY name LIMIT 500');
    res.json({ drugs: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'list_failed' });
  }
}

async function dispense(req, res) {
  try {
    // payload: [{drug_id, quantity}] and prescription_id (optional)
    const { items, prescription_id } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'no_items' });
    const client = db.pool;
    const conn = await client.connect();
    try {
      await conn.query('BEGIN');
      for (const it of items) {
        const d = (await conn.query('SELECT stock FROM drugs WHERE id=$1 FOR UPDATE', [it.drug_id])).rows[0];
        if (!d) throw new Error('drug_not_found');
        if (d.stock < it.quantity) throw new Error('insufficient_stock');
        await conn.query('UPDATE drugs SET stock=stock - $1 WHERE id=$2', [it.quantity, it.drug_id]);
      }
      await conn.query('COMMIT');
      res.json({ ok: true });
    } catch (e) {
      await conn.query('ROLLBACK');
      throw e;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'dispense_failed', message: err.message });
  }
}

async function expiryReport(req, res) {
  try {
    const days = parseInt(req.query.days || '90', 10);
    const r = await db.query('SELECT * FROM drugs WHERE expiry_date IS NOT NULL AND expiry_date <= (CURRENT_DATE + $1::int)', [days]);
    res.json({ near_expiry: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'expiry_failed' });
  }
}

module.exports = { addDrug, updateDrug, listDrugs, dispense, expiryReport };
