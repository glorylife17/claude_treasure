const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getStatsById, applyRoundResult } = require('../db');

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
  const stats = getStatsById(req.userId);
  if (!stats) return res.status(401).json({ error: 'Unauthorized' });
  res.json(stats);
});

router.post('/submit', requireAuth, (req, res) => {
  const { score } = req.body || {};
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    return res.status(400).json({ error: 'score must be a number' });
  }

  const stats = applyRoundResult(req.userId, score);
  res.json(stats);
});

module.exports = router;
