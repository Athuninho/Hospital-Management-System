const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/labController');

router.post('/tests', auth, controller.addTest);
router.get('/tests', auth, controller.listTests);
router.post('/requests', auth, controller.createRequests);
router.post('/results/:requestId', auth, controller.enterResult);
router.get('/results/visit/:visitId', auth, controller.resultsByVisit);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const controller = require('../controllers/labController');

router.post('/tests', auth, controller.createTest);
router.get('/tests', auth, controller.listTests);
router.post('/requests', auth, controller.createRequests);
router.post('/results/:requestId', auth, controller.enterResult);
router.get('/results/visit/:visitId', auth, controller.getResultsByVisit);

module.exports = router;
