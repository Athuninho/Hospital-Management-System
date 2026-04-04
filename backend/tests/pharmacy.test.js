const { dispense } = require('../src/controllers/pharmacyController');

// Mock db module used by controller
jest.mock('../src/db', () => {
  const mockClient = {
    query: jest.fn((text, params) => {
      const sql = (text || '').toString();
      if (sql.includes('SELECT stock FROM drugs')) return Promise.resolve({ rows: [{ stock: 10 }] });
      if (sql.includes('UPDATE drugs SET stock')) return Promise.resolve({ rows: [] });
      if (sql.includes('SELECT visit_id FROM prescriptions')) return Promise.resolve({ rows: [{ visit_id: 'visit-123' }] });
      if (sql.includes('SELECT * FROM invoices WHERE visit_id')) return Promise.resolve({ rows: [] });
      if (sql.includes('INSERT INTO invoices')) return Promise.resolve({ rows: [{ id: 'inv-1', total_amount: 0, nhif_covered_amount: 0, patient_balance: 0 }] });
      if (sql.includes('SELECT name, price_kes FROM drugs')) return Promise.resolve({ rows: [{ name: 'Paracetamol', price_kes: 10 }] });
      if (sql.includes('INSERT INTO invoice_items')) return Promise.resolve({ rows: [] });
      if (sql.includes('UPDATE invoices SET total_amount')) return Promise.resolve({ rows: [] });
      return Promise.resolve({ rows: [] });
    })
  };
  return {
    query: jest.fn(),
    pool: {
      connect: jest.fn(() => Promise.resolve(mockClient))
    }
  };
});

describe('pharmacy dispense', ()=>{
  it('dispenses items and creates invoice items when prescription provided', async ()=>{
    const req = {
      body: { items: [{ drug_id: 'drug-1', quantity: 2 }], prescription_id: 'pres-1' },
      user: { sub: 'user-1' }
    };
    const res = { json: jest.fn(), status: jest.fn(() => res) };
    await dispense(req, res);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });
});
