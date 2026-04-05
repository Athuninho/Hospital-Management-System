const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const controller = require('../controllers/pharmacyController');

router.post('/drugs', verifyToken, controller.addDrug);
router.put('/drugs/:id', verifyToken, controller.updateDrug);
router.get('/drugs', verifyToken, controller.listDrugs);
router.post('/dispense', verifyToken, controller.dispense);
router.get('/expiry', verifyToken, controller.expiryReport);
router.get('/prescription/:id', verifyToken, controller.getPrescription);

module.exports = router;
