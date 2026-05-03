const jwt = require('jsonwebtoken');
module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'no_token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // normalize payload: provide `id` and `role` fields
    req.user = { id: payload.sub, role: payload.role || null };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid_token' });
  }
};
