const db = require('../db');

async function computeInvoice(visitId, createdBy = null) {
  // This is a simplified aggregator. In a real system, gather consultation, lab, prescriptions, bed days.
  // For demo, we'll compute using invoice_items already created (if any) or create a placeholder.
  const itemsRes = await db.query('SELECT * FROM invoice_items WHERE invoice_id IN (SELECT id FROM invoices WHERE visit_id=$1)', [visitId]);
  let items = itemsRes.rows || [];
  if (!items.length) {
    // placeholder example: consultation KES 500
    items = [{ description: 'Consultation', qty: 1, unit_price: 500.00, total: 500.00, category: 'consultation' }];
  }
  const total = items.reduce((s, it) => s + parseFloat(it.total || (it.qty * it.unit_price)), 0);

  // fetch patient to check NHIF
  const p = await db.query('SELECT p.* FROM patients p JOIN visits v ON v.patient_id=p.id WHERE v.id=$1', [visitId]);
  const patient = p.rows[0] || null;
  let nhifCovered = 0;
  if (patient && patient.nhif_number) {
    // Simplified rule: outpatient covers consultation & lab fully
    nhifCovered = items.filter(i => i.category === 'consultation' || i.category === 'lab').reduce((s, it) => s + parseFloat(it.total || (it.qty * it.unit_price)), 0);
  }

  const patientBalance = Math.max(0, total - nhifCovered);

  const inv = await db.query(
    `INSERT INTO invoices (visit_id, created_by, total_amount, nhif_covered_amount, patient_balance, status)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [visitId, createdBy, total, nhifCovered, patientBalance, patient && patient.nhif_number ? 'nhif_claim' : 'pending']
  );

  for (const it of items) {
    await db.query('INSERT INTO invoice_items (invoice_id, description, qty, unit_price, total) VALUES ($1,$2,$3,$4,$5)', [inv.rows[0].id, it.description, it.qty || 1, it.unit_price || it.price_kes || 0, it.total || (it.qty * it.unit_price)]);
  }

  return { invoice: inv.rows[0], items };
}

module.exports = { computeInvoice };
