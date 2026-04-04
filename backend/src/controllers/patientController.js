const db = require('../db');

async function createPatient(req, res) {
  try {
    const { nhif_number, national_id, first_name, last_name, gender, dob, phone, email, address, next_of_kin } = req.body;
    if (!first_name || !last_name) return res.status(400).json({ error: 'missing_name' });
    const result = await db.query(
      `INSERT INTO patients (nhif_number, national_id, first_name, last_name, gender, dob, phone, email, address, next_of_kin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [nhif_number, national_id, first_name, last_name, gender, dob, phone, email, address, next_of_kin || null]
    );
    res.json({ patient: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create_failed' });
  }
}

async function getPatient(req, res) {
  try {
    const id = req.params.id;
    const r = await db.query('SELECT * FROM patients WHERE id=$1', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'not_found' });
    res.json({ patient: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'get_failed' });
  }
}

async function searchPatients(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ patients: [] });
    const like = `%${q}%`;
    const r = await db.query('SELECT * FROM patients WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR national_id ILIKE $1 OR phone ILIKE $1 LIMIT 50', [like]);
    res.json({ patients: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'search_failed' });
  }
}

module.exports = { createPatient, getPatient, searchPatients };
