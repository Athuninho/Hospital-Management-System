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
    const { items, prescription_id, visit_id } = req.body;
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

      // After stock decrement, attach items to invoice if visit or prescription provided
      let resolvedVisitId = visit_id || null;
      if (!resolvedVisitId && prescription_id) {
        const pres = await conn.query('SELECT visit_id FROM prescriptions WHERE id=$1', [prescription_id]);
        if (pres.rows[0]) resolvedVisitId = pres.rows[0].visit_id;
      }

      if (resolvedVisitId) {
        // find existing open invoice for visit
        let inv = (await conn.query("SELECT * FROM invoices WHERE visit_id=$1 AND status IN ('pending','partial','nhif_claim') ORDER BY created_at DESC LIMIT 1", [resolvedVisitId])).rows[0];
        if (!inv) {
          const created = await conn.query('INSERT INTO invoices (visit_id, created_by, total_amount, nhif_covered_amount, patient_balance, status) VALUES ($1,$2,0,0,0,$3) RETURNING *', [resolvedVisitId, req.user?.sub || null, 'pending']);
          inv = created.rows[0];
        }

        // insert invoice items and update totals
        let addedTotal = 0;
        for (const it of items) {
          const drugRow = (await conn.query('SELECT name, price_kes FROM drugs WHERE id=$1', [it.drug_id])).rows[0];
          const unit_price = parseFloat(drugRow?.price_kes || 0);
          const qty = parseInt(it.quantity || 0, 10);
          const total = unit_price * qty;
          addedTotal += total;
          await conn.query('INSERT INTO invoice_items (invoice_id, description, qty, unit_price, total) VALUES ($1,$2,$3,$4,$5)', [inv.id, `Drug: ${drugRow?.name || it.drug_id}`, qty, unit_price, total]);
        }
        // update invoice totals
        await conn.query('UPDATE invoices SET total_amount = COALESCE(total_amount,0) + $1, patient_balance = COALESCE(patient_balance,0) + $1 WHERE id=$2', [addedTotal, inv.id]);
      }
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

async function getPrescription(req, res) {
  try {
    const id = req.params.id;
    const r = await db.query(`SELECT pi.id, pi.drug_id, pi.quantity, d.name, d.price_kes FROM prescription_items pi JOIN drugs d ON d.id=pi.drug_id WHERE pi.prescription_id=$1`, [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
    // map to dispense rows
    const rows = r.rows.map(rw => ({ drug_id: rw.drug_id, quantity: rw.quantity, label: `${rw.name} (KES ${rw.price_kes})` }));
    res.json({ items: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'prescription_failed' });
  }
}

module.exports = { addDrug, updateDrug, listDrugs, dispense, expiryReport, getPrescription };

