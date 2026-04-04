const db = require('../db');
const mpesaService = require('../services/mpesaService');
const smsService = require('../services/smsService');
const { generateInvoicePdf } = require('../services/pdfService');

const createInvoice = async (req, res) => {
  try {
    const { visit_id, items } = req.body; // items: [{description, qty, unit_price}]
    
    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + (item.qty * item.unit_price), 0);
    
    // Start transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const invResult = await client.query(
        `INSERT INTO invoices (visit_id, total_amount, patient_balance, status) 
         VALUES ($1, $2, $3, 'pending') RETURNING *`,
        [visit_id, totalAmount, totalAmount] // Initially balance = total
      );
      
      const invoice = invResult.rows[0];
      
      for (let item of items) {
        await client.query(
          `INSERT INTO invoice_items (invoice_id, description, qty, unit_price, total) 
           VALUES ($1, $2, $3, $4, $5)`,
          [invoice.id, item.description, item.qty, item.unit_price, item.qty * item.unit_price]
        );
      }
      
      await client.query('COMMIT');
      res.status(201).json({ invoice });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM invoices ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const payInvoice = async (req, res) => {
  try {
    const { id } = req.params; // invoice ID
    const { method, amount, phone } = req.body; // method: cash, mpesa
    
    // Basic validation
    const invRes = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (invRes.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    const invoice = invRes.rows[0];
    
    if (method === 'mpesa' && phone) {
      // Simulate STK Push
      const stkRes = await mpesaService.triggerSTKPush(phone, amount, invoice.id);
      
      // We would normally wait for the callback. For MVP, mark as paid if STK push is successful
      await db.query(`UPDATE invoices SET status = 'paid', patient_balance = patient_balance - $1 WHERE id = $2`, [amount, id]);
      await db.query(`INSERT INTO payments (invoice_id, amount, method, transaction_ref) VALUES ($1, $2, 'mpesa', $3)`, [id, amount, stkRes.CheckoutRequestID]);
      
      await smsService.sendPaymentConfirmation(phone, invoice.id, amount);
      return res.status(200).json({ message: 'M-Pesa STK Push initiated (Simulated paid state)', mpesa: stkRes });
    } else if (method === 'cash') {
      await db.query(`UPDATE invoices SET status = 'paid', patient_balance = patient_balance - $1 WHERE id = $2`, [amount, id]);
      await db.query(`INSERT INTO payments (invoice_id, amount, method) VALUES ($1, $2, 'cash')`, [id, amount]);
      
      if (phone) {
        await smsService.sendPaymentConfirmation(phone, invoice.id, amount);
      }
      return res.status(200).json({ message: 'Cash payment processed successfully' });
    }
    
    res.status(400).json({ error: 'Invalid payment method or missing parameters' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const processNHIFClaim = async (req, res) => {
  try {
    const { id } = req.params; // invoice ID
    const { covered_amount } = req.body;
    
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      
      const invRes = await client.query('SELECT * FROM invoices WHERE id = $1', [id]);
      if (invRes.rows.length === 0) throw new Error('Invoice not found');
      
      // Update Invoice
      await client.query(
        `UPDATE invoices SET nhif_covered_amount = $1, patient_balance = total_amount - $1, status = 'nhif_claim' WHERE id = $2`,
        [covered_amount, id]
      );
      
      // Create claim
      await client.query(
        `INSERT INTO nhif_claims (invoice_id, status) VALUES ($1, 'draft')`,
        [id]
      );
      
      await client.query('COMMIT');
      res.status(200).json({ message: 'NHIF Cover applied successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const downloadInvoiceReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invRes = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
    if (invRes.rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    const invoice = invRes.rows[0];
    
    const itemsRes = await db.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
    const items = itemsRes.rows;
    
    const buffer = await generateInvoicePdf(invoice, items);
    
    res.setHeader('Content-disposition', `attachment; filename=invoice_${id}.pdf`);
    res.setHeader('Content-type', 'application/pdf');
    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createInvoice, payInvoice, processNHIFClaim, getInvoices, downloadInvoiceReceipt };
