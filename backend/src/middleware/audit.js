const db = require('../db');
async function auditMiddleware(req, res, next) {
  res.on('finish', async () => {
    try {
      const userId = req.user?.sub || null;
      await db.query(
        'INSERT INTO audit_logs (user_id, action, object_type, object_id, details) VALUES ($1,$2,$3,$4,$5)',
        [userId, `${req.method} ${req.path}`, null, null, { status: res.statusCode }]
      );
    } catch (err) {
      console.error('audit error', err.message || err);
    }
  });
  next();
}

module.exports = { auditMiddleware };
