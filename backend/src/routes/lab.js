const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const controller = require('../controllers/labController');

router.post('/tests', verifyToken, controller.addTest);
router.get('/tests', verifyToken, controller.listTests);
router.post('/requests', verifyToken, controller.createRequests);
router.post('/results/:requestId', verifyToken, controller.enterResult);
router.get('/results/visit/:visitId', verifyToken, controller.resultsByVisit);

module.exports = router;
