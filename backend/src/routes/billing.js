const express = require('express');
const router = express.Router();
const { createInvoice, payInvoice, processNHIFClaim, getInvoices, downloadInvoiceReceipt } = require('../controllers/billingController');
const { verifyToken, requireRole } = require('../middleware/auth');

// only billing staff or admin
router.post('/invoice', verifyToken, requireRole(['billing','admin']), createInvoice);
router.get('/invoices', verifyToken, requireRole(['billing','admin']), getInvoices);
router.post('/nhif-claim/:id', verifyToken, requireRole(['billing','admin']), processNHIFClaim);
router.post('/pay/:id', verifyToken, requireRole(['billing','admin']), payInvoice);
router.get('/download/:id', verifyToken, requireRole(['billing','admin']), downloadInvoiceReceipt);

module.exports = router;
