
const express = require('express');
const Attempt = require('../models/Attempt');
const router = express.Router();

// simple learning curve: average score per day for last 14 days
router.get('/learning-curve', async (req,res)=>{
  const since = new Date(); since.setDate(since.getDate()-14);
  const agg = await Attempt.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, avgScore: { $avg: '$score' } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(agg);
});

module.exports = router;
