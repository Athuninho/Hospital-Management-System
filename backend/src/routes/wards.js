const express = require('express');
const router = express.Router();
const { getWards, getWardBeds, allocateBed } = require('../controllers/wardController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, getWards);
router.get('/:wardId/beds', verifyToken, getWardBeds);
router.post('/allocate', verifyToken, allocateBed);

module.exports = router;
