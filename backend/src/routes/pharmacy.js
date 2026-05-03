const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const controller = require('../controllers/pharmacyController');

router.post('/drugs', verifyToken, requireRole(['pharmacy','admin']), controller.addDrug);
router.put('/drugs/:id', verifyToken, requireRole(['pharmacy','admin']), controller.updateDrug);
router.get('/drugs', verifyToken, requireRole(['pharmacy','admin']), controller.listDrugs);
router.post('/dispense', verifyToken, requireRole(['pharmacy','admin']), controller.dispense);
router.get('/expiry', verifyToken, requireRole(['pharmacy','admin']), controller.expiryReport);
router.get('/prescription/:id', verifyToken, requireRole(['pharmacy','admin']), controller.getPrescription);

module.exports = router;
