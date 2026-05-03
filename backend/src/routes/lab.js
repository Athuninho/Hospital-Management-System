const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const controller = require('../controllers/labController');

router.post('/tests', verifyToken, requireRole(['lab','admin']), controller.addTest);
router.get('/tests', verifyToken, requireRole(['lab','admin']), controller.listTests);
router.post('/requests', verifyToken, requireRole(['lab','admin']), controller.createRequests);
router.post('/results/:requestId', verifyToken, requireRole(['lab','admin']), controller.enterResult);
router.get('/results/visit/:visitId', verifyToken, requireRole(['lab','admin']), controller.resultsByVisit);

module.exports = router;
