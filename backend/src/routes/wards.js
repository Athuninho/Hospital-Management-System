const express = require('express');
const router = express.Router();
const { getWards, getWardBeds, allocateBed } = require('../controllers/wardController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole(['nurse','doctor','admin']), getWards);
router.get('/:wardId/beds', verifyToken, requireRole(['nurse','doctor','admin']), getWardBeds);
router.post('/allocate', verifyToken, requireRole(['nurse','admin']), allocateBed);

module.exports = router;
