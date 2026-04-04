const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const { computeInvoice } = require('../services/billingService');

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

module.exports = router;
