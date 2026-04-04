const express = require('express');
const router = express.Router();
const auth = require('../middleware/authJwt');
const nhifService = require('../services/nhifService');

// Create claim (draft)
router.post('/claim/create', auth, async (req, res) => {
  try {
    const { invoiceId } = req.body;
    if (!invoiceId) return res.status(400).json({ error: 'missing_invoice' });
    const claim = await nhifService.createClaim(invoiceId);
    res.json({ claim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create_failed' });
  }
});

// Submit claim for processing (simulated)
router.post('/claim/submit', auth, async (req, res) => {
  try {
    const { claimId } = req.body;
    if (!claimId) return res.status(400).json({ error: 'missing_claim' });
    const claim = await nhifService.submitClaim(claimId);
    res.json({ claim });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'submit_failed' });
  }
});

module.exports = router;
