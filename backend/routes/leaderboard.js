const express = require('express');
const router = express.Router();
const Gamification = require('../models/Gamification');
const User = require('../models/User');

// Get top 50 leaderboard
router.get('/', async (req, res) => {
  try {
    const entries = await Gamification.find()
      .populate('user', 'name email')
      .sort({xp: -1})
      .limit(50);
    
    const leaderboard = entries.map((entry, idx) => ({
      rank: idx + 1,
      name: entry.user?.name || 'Unknown',
      xp: entry.xp,
      level: entry.level,
      badges: entry.badges.length,
      streak: entry.streak
    }));
    
    res.json(leaderboard);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

// Get user's leaderboard position
router.get('/me', async (req, res) => {
  try {
    const { verify } = require('../utils/jwt');
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    const userGamification = await Gamification.findOne({user: payload.sub});
    if(!userGamification) {
      return res.json({rank: 0, xp: 0, level: 1});
    }
    
    const rank = await Gamification.countDocuments({xp: {$gt: userGamification.xp}}) + 1;
    
    res.json({
      rank,
      xp: userGamification.xp,
      level: userGamification.level,
      badges: userGamification.badges,
      streak: userGamification.streak
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;