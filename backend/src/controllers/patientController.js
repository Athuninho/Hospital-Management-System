const db = require('../db');

const registerPatient = async (req, res) => {
  try {
    const { nhif_number, national_id, first_name, last_name, gender, dob, phone, email, address, next_of_kin } = req.body;
    const result = await db.query(
      `INSERT INTO patients (nhif_number, national_id, first_name, last_name, gender, dob, phone, email, address, next_of_kin)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [nhif_number, national_id, first_name, last_name, gender, dob, phone, email, address, next_of_kin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPatientById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerPatient, getPatients, getPatientById };
