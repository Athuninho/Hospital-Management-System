const db = require('../db');

const getWards = async (req, res) => {
  try {
    const r = await db.query('SELECT * FROM wards ORDER BY name');
    res.json({ wards: r.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWardBeds = async (req, res) => {
  try {
    const { wardId } = req.params;
    const r = await db.query(`
      SELECT b.*, a.id as active_admission_id, p.first_name, p.last_name 
      FROM beds b
      LEFT JOIN admissions a ON a.bed_id = b.id AND a.discharge_time IS NULL
      LEFT JOIN visits v ON v.id = a.visit_id
      LEFT JOIN patients p ON p.id = v.patient_id
      WHERE b.ward_id = $1 ORDER BY b.bed_number
    `, [wardId]);
    res.json({ beds: r.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const allocateBed = async (req, res) => {
  try {
    const { visit_id, bed_id } = req.body;
    
    // Check if bed is available
    const bedRes = await db.query('SELECT is_available FROM beds WHERE id = $1', [bed_id]);
    if (!bedRes.rows.length || !bedRes.rows[0].is_available) {
      return res.status(400).json({ error: 'Bed is not available' });
    }

    const client = await db.pool.connect();
    let admission;
    try {
      await client.query('BEGIN');
      await client.query('UPDATE beds SET is_available = false WHERE id = $1', [bed_id]);
      const admRes = await client.query(
        'INSERT INTO admissions (visit_id, bed_id, admitted_by) VALUES ($1, $2, $3) RETURNING *',
        [visit_id, bed_id, req.user?.sub || null]
      );
      admission = admRes.rows[0];
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    
    res.status(201).json(admission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getWards, getWardBeds, allocateBed };
