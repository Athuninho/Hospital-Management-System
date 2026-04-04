const express = require('express');
const router = express.Router();
const { registerPatient, getPatients, getPatientById, uploadPatientFile } = require('../controllers/patientController');
const { verifyToken } = require('../middleware/auth');
const upload = require('../services/uploadService');

// Make it optional so testing works easier without seeding initially.
router.post('/', registerPatient);
router.get('/', getPatients);
router.get('/:id', getPatientById);

// Document uploading
router.post('/:id/upload', upload.single('document'), uploadPatientFile);

module.exports = router;
