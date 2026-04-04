const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const { computeInvoice } = require('../services/billingService');
const db = require('../db');
const pdfService = require('../services/pdfService');

router.post('/compute/:visitId', auth, async (req, res) => {
  try {
    const visitId = req.params.visitId;
    const createdBy = req.user?.sub || null;
    const result = await computeInvoice(visitId, createdBy);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'compute_failed' });
  }
});

// Pay an invoice (cash, mpesa)
router.post('/pay', auth, async (req, res) => {
  try {
    const { invoiceId, amount, method, transaction_ref, metadata } = req.body;
    if (!invoiceId || !amount || !method) return res.status(400).json({ error: 'missing_fields' });
    await db.query('INSERT INTO payments (invoice_id, amount, method, transaction_ref, metadata, paid_by) VALUES ($1,$2,$3,$4,$5,$6)', [invoiceId, amount, method, transaction_ref || null, metadata || null, req.user?.sub || null]);
    // Update invoice status if fully paid
    const paidSumRes = await db.query('SELECT COALESCE(SUM(amount),0) as paid FROM payments WHERE invoice_id=$1', [invoiceId]);
    const paid = parseFloat(paidSumRes.rows[0].paid || 0);
    const invRes = await db.query('SELECT total_amount FROM invoices WHERE id=$1', [invoiceId]);
    const total = parseFloat(invRes.rows[0].total_amount || 0);
    const status = paid >= total ? 'paid' : 'partial';
    await db.query('UPDATE invoices SET status=$1 WHERE id=$2', [status, invoiceId]);
    res.json({ ok: true, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'payment_failed' });
  }
});

// Get invoice PDF (generate on demand)
router.get('/:invoiceId/pdf', auth, async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const inv = (await db.query('SELECT * FROM invoices WHERE id=$1', [invoiceId])).rows[0];
    if (!inv) return res.status(404).json({ error: 'invoice_not_found' });
    const items = (await db.query('SELECT description, qty, unit_price, total FROM invoice_items WHERE invoice_id=$1', [invoiceId])).rows;
    const pdfBuffer = await pdfService.generateInvoicePdf(inv, items);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('pdf error', err);
    res.status(500).json({ error: 'pdf_failed' });
  }
});

module.exports = router;
