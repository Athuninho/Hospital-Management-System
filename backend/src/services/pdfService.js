const PDFDocument = require('pdfkit');
const getStream = require('get-stream');

async function generateInvoicePdf(invoice, items = []) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  doc.fontSize(20).text('Mombasa Hospital - Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice: ${invoice.id}`);
  doc.text(`Visit: ${invoice.visit_id}`);
  doc.text(`Date: ${invoice.created_at}`);
  doc.moveDown();
  // Table header
  doc.fontSize(12).text('Description', 50, doc.y, { width: 300 });
  doc.text('Qty', 360, doc.y - 15, { width: 50 });
  doc.text('Unit', 420, doc.y - 15, { width: 80 });
  doc.text('Total', 520, doc.y - 15, { width: 80 });
  doc.moveDown();
  for (const it of items) {
    doc.text(it.description, { continued: true });
    doc.text(String(it.qty || 1), 360);
    doc.text(String(it.unit_price || ''), 420);
    doc.text(String(it.total || (it.qty * it.unit_price || 0)), 520);
    doc.moveDown();
  }
  doc.moveDown();
  doc.text(`Total: KES ${invoice.total_amount}`, { align: 'right' });
  doc.text(`NHIF Cover: KES ${invoice.nhif_covered_amount}`, { align: 'right' });
  doc.text(`Patient Balance: KES ${invoice.patient_balance}`, { align: 'right' });
  doc.end();
  const buffer = await getStream.buffer(doc);
  return buffer;
}

module.exports = { generateInvoicePdf };
