const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const authJwt = require('../middleware/authJwt');

router.post('/login', login);
router.post('/register', register);

// example protected endpoint: returns current user info
router.get('/me', authJwt, (req, res) => {
	res.json({ user: req.user });
});

module.exports = router;
