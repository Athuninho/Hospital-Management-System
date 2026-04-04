const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const mpesa = require('../services/mpesaService');
const db = require('../db');

router.post('/mpesa/stk', auth, async (req, res) => {
  try {
    const { phone, amount, invoiceId } = req.body;
    const resp = await mpesa.stkPush(phone, amount, invoiceId);
    res.json({ result: resp });
  } catch (err) {
    console.error(err.message || err);
    res.status(500).json({ error: 'mpesa_failed', message: err.message });
  }
});

// M-Pesa callback endpoint (Daraja)
router.post('/mpesa/callback', async (req, res) => {
  try {
    const body = req.body;
    // Expected structure varies; save payload for manual processing.
    await db.query('INSERT INTO payments (invoice_id, amount, method, transaction_ref, metadata) VALUES ($1,$2,$3,$4,$5)', [body?.Body?.stkCallback?.CheckoutRequestID || null, null, 'mpesa', body?.Body?.stkCallback?.CheckoutRequestID || null, body]);
    // In production, parse result and update invoice/payment accordingly
    res.status(200).send({ received: true });
  } catch (err) {
    console.error('mpesa callback error', err.message || err);
    res.status(500).send({ error: 'callback_error' });
  }
});

module.exports = router;
