const db = require('../db');
const { v4: uuidv4 } = require('uuid');

async function createClaim(invoiceId) {
  const ref = `NHIF-${Date.now()}`;
  const r = await db.query('INSERT INTO nhif_claims (invoice_id, claim_reference, status, submitted_at) VALUES ($1,$2,$3,$4) RETURNING *', [invoiceId, ref, 'draft', null]);
  return r.rows[0];
}

async function submitClaim(claimId) {
  // mark as submitted; worker will process and simulate NHIF response
  const now = new Date();
  const r = await db.query('UPDATE nhif_claims SET status=$1, submitted_at=$2 WHERE id=$3 RETURNING *', ['submitted', now, claimId]);
  return r.rows[0];
}

async function finalizeClaimAsApproved(claimId) {
  // mark approved and create payment for invoice equal to invoice.nhif_covered_amount
  const claim = (await db.query('SELECT * FROM nhif_claims WHERE id=$1', [claimId])).rows[0];
  if (!claim) throw new Error('claim_not_found');
  await db.query('UPDATE nhif_claims SET status=$1, response=$2 WHERE id=$3', ['approved', { approved_at: new Date() }, claimId]);
  const inv = (await db.query('SELECT * FROM invoices WHERE id=$1', [claim.invoice_id])).rows[0];
  const amount = parseFloat(inv.nhif_covered_amount || 0);
  if (amount > 0) {
    await db.query('INSERT INTO payments (invoice_id, amount, method, transaction_ref, metadata, paid_by) VALUES ($1,$2,$3,$4,$5,$6)', [inv.id, amount, 'nhif', claim.claim_reference, { automated: true }, null]);
  }
  // update invoice status depending on paid sum
  const paidSumRes = await db.query('SELECT COALESCE(SUM(amount),0) as paid FROM payments WHERE invoice_id=$1', [inv.id]);
  const paid = parseFloat(paidSumRes.rows[0].paid || 0);
  const total = parseFloat(inv.total_amount || 0);
  const status = paid >= total ? 'paid' : (paid > 0 ? 'partial' : 'nhif_claim');
  await db.query('UPDATE invoices SET status=$1 WHERE id=$2', [status, inv.id]);
  return { claimId, status };
}

module.exports = { createClaim, submitClaim, finalizeClaimAsApproved };
