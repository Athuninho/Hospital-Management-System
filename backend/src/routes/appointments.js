const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments } = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/auth');

router.post('/', bookAppointment);
router.get('/', getAppointments);

module.exports = router;
