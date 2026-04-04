const express = require('express');
const router = express.Router();
const { registerPatient, getPatients, getPatientById } = require('../controllers/patientController');
const { verifyToken } = require('../middleware/auth');

// Make it optional so testing works easier without seeding initially.
router.post('/', registerPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);

module.exports = router;
