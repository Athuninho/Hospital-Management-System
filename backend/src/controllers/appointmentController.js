const db = require('../db');
const smsService = require('../services/smsService');

const bookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, department, scheduled_time, reason } = req.body;
    
    // In actual implementation this goes into an `appointments` table or maps to `visits` with status 'scheduled'
    const result = await db.query(
      `INSERT INTO visits (patient_id, doctor_id, department, reason, status, start_time) 
       VALUES ($1, $2, $3, $4, 'scheduled', $5) RETURNING *`,
      [patient_id, doctor_id, department, reason, scheduled_time]
    );

    const visit = result.rows[0];

    // Fetch patient phone to send SMS
    const patientRes = await db.query('SELECT phone, first_name FROM patients WHERE id = $1', [patient_id]);
    if (patientRes.rows.length > 0 && patientRes.rows[0].phone) {
      const patient = patientRes.rows[0];
      const docRes = await db.query('SELECT full_name FROM users WHERE id = $1', [doctor_id]);
      const docName = docRes.rows.length > 0 ? docRes.rows[0].full_name : 'the Doctor';
      
      // Send the SMS
      await smsService.sendAppointmentReminder(patient.phone, new Date(scheduled_time).toLocaleString(), docName);
    }
    
    res.status(201).json(visit);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const result = await db.query(`SELECT v.*, p.first_name, p.last_name, p.phone, u.full_name as doctor_name 
                                   FROM visits v 
                                   JOIN patients p ON v.patient_id = p.id
                                   LEFT JOIN users u ON v.doctor_id = u.id
                                   WHERE v.status = 'scheduled' ORDER BY v.start_time ASC`);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { bookAppointment, getAppointments };
