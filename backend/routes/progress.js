const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Gamification = require('../models/Gamification');
const { verify } = require('../utils/jwt');

// Get student's progress for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    let progress = await Progress.findOne({
      student: payload.sub,
      course: req.params.courseId
    }).populate('course', 'title modules');
    
    if(!progress) {
      progress = new Progress({
        student: payload.sub,
        course: req.params.courseId,
        completedModules: [],
        scoreHistory: [],
        weakTopics: [],
        strongTopics: []
      });
      await progress.save();
    }
    
    res.json(progress);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

// Mark module as complete
router.post('/module/complete', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    const { courseId, moduleIndex } = req.body;
    
    let progress = await Progress.findOne({student: payload.sub, course: courseId});
    if(!progress) {
      progress = new Progress({student: payload.sub, course: courseId});
    }
    
    if(!progress.completedModules.includes(moduleIndex)) {
      progress.completedModules.push(moduleIndex);
      await progress.save();
      
      // Award XP
      let gamification = await Gamification.findOne({user: payload.sub});
      if(!gamification) {
        gamification = new Gamification({user: payload.sub});
      }
      gamification.xp += 50;
      gamification.level = Math.floor(gamification.xp / 500) + 1;
      await gamification.save();
    }
    
    res.json(progress);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;