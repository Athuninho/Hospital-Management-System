const db = require('../db');

async function addTest(req, res) {
  try {
    const { code, name, description, price_kes } = req.body;
    if (!name) return res.status(400).json({ error: 'missing_name' });
    const r = await db.query('INSERT INTO lab_tests (code, name, description, price_kes) VALUES ($1,$2,$3,$4) RETURNING *', [code || null, name, description || null, price_kes || 0]);
    res.json({ test: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'create_failed' });
  }
}

async function listTests(req, res) {
  try {
    const r = await db.query('SELECT * FROM lab_tests ORDER BY name');
    res.json({ tests: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'list_failed' });
  }
}

async function createRequests(req, res) {
  try {
    const { visit_id, requested_by, test_ids } = req.body;
    if (!visit_id || !Array.isArray(test_ids) || !test_ids.length) return res.status(400).json({ error: 'missing_fields' });
    const created = [];
    for (const testId of test_ids) {
      const r = await db.query('INSERT INTO lab_requests (visit_id, requested_by, requested_at, status) VALUES ($1,$2,NOW(),$3) RETURNING *', [visit_id, requested_by || req.user?.sub || null, 'pending']);
      // also create lab_results placeholder linking to test
      await db.query('INSERT INTO lab_results (request_id, test_id, result, entered_by) VALUES ($1,$2,$3,$4)', [r.rows[0].id, testId, null, null]);
      created.push(r.rows[0]);
    }
    res.json({ requests: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'request_failed' });
  }
}

async function enterResult(req, res) {
  try {
    const requestId = req.params.requestId;
    const { test_id, result } = req.body;
    if (!test_id) return res.status(400).json({ error: 'missing_test' });
    // update existing lab_results record for request + test
    const r = await db.query('UPDATE lab_results SET result=$1, entered_by=$2, entered_at=NOW() WHERE request_id=$3 AND test_id=$4 RETURNING *', [result, req.user?.sub || null, requestId, test_id]);
    await db.query('UPDATE lab_requests SET status=$1 WHERE id=$2', ['completed', requestId]);
    res.json({ result: r.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'enter_failed' });
  }
}

async function resultsByVisit(req, res) {
  try {
    const visitId = req.params.visitId;
    const r = await db.query(`
      SELECT lr.id as request_id, lr.requested_at, lr.status, lres.test_id, lres.result, lt.name as test_name
      FROM lab_requests lr
      LEFT JOIN lab_results lres ON lres.request_id = lr.id
      LEFT JOIN lab_tests lt ON lt.id = lres.test_id
      WHERE lr.visit_id = $1`, [visitId]);
    res.json({ results: r.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'query_failed' });
  }
}

module.exports = { addTest, listTests, createRequests, enterResult, resultsByVisit };
