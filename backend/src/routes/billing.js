const express = require('express');
const router = express.Router();
const { createInvoice, payInvoice, processNHIFClaim, getInvoices } = require('../controllers/billingController');
const { verifyToken } = require('../middleware/auth');

router.post('/invoice', createInvoice);
router.get('/invoices', getInvoices);
router.post('/nhif-claim/:id', processNHIFClaim);
router.post('/pay/:id', payInvoice);

module.exports = router;
