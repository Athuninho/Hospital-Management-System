const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/pharmacyController');

router.post('/drugs', auth, controller.addDrug);
router.put('/drugs/:id', auth, controller.updateDrug);
router.get('/drugs', auth, controller.listDrugs);
router.post('/dispense', auth, controller.dispense);
router.get('/expiry', auth, controller.expiryReport);
router.get('/prescription/:id', auth, controller.getPrescription);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const { addDrug, listDrugs, dispensePrescription } = require('../controllers/pharmacyController');

router.get('/drugs', auth, listDrugs);
router.post('/drugs', auth, addDrug);
router.post('/dispense', auth, dispensePrescription);

module.exports = router;
