const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const { createPatient, getPatient, searchPatients } = require('../controllers/patientController');

router.post('/', auth, createPatient);
router.get('/:id', auth, getPatient);
router.get('/', auth, searchPatients);

module.exports = router;
