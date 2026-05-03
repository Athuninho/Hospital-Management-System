module.exports = function (allowedRoles) {
  if (!allowedRoles) allowedRoles = [];
  if (typeof allowedRoles === 'string') allowedRoles = [allowedRoles];

  return function (req, res, next) {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'unauthenticated' });
    const userRole = user.role || null;
    // if no roles specified, allow any authenticated user
    if (!allowedRoles.length) return next();
    if (allowedRoles.includes(userRole)) return next();
    return res.status(403).json({ error: 'forbidden' });
  };
};
