const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided.' });

  const tokenBody = token.split(' ')[1];
  
  jwt.verify(tokenBody, process.env.JWT_SECRET || 'supersecret123', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized.' });
    req.user = decoded;
    next();
  });
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };
