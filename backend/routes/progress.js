const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Attempt = require('../models/Attempt');
const { verify } = require('../utils/jwt');

// Generate personalized learning plan
router.post('/learning-plan', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    const { courseId, examDate } = req.body;
    
    // Get student's progress
    const progress = await Progress.findOne({student: payload.sub, course: courseId})
      .populate('course');
    
    // Get recent attempts
    const attempts = await Attempt.find({user: payload.sub})
      .sort({createdAt: -1})
      .limit(10);
    
    const avgScore = attempts.length > 0 
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length 
      : 0;
    
    // Generate 7-day study plan
    const daysUntilExam = examDate ? Math.ceil((new Date(examDate) - new Date()) / (1000*60*60*24)) : 30;
    const studyPlan = generateStudyPlan(progress, avgScore, daysUntilExam);
    
    res.json(studyPlan);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

function generateStudyPlan(progress, avgScore, daysUntilExam) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plan = {
    weeklyGoal: avgScore < 60 ? 'Master fundamentals' : avgScore < 80 ? 'Practice advanced topics' : 'Perfect your skills',
    daysUntilExam,
    motivationalMessage: avgScore < 60 
      ? 'Every expert was once a beginner. Keep going!' 
      : avgScore < 80 
      ? 'Great progress! Push yourself further.' 
      : 'Excellence in progress. Stay focused!',
    dailySchedule: days.map((day, idx) => ({
      day,
      tasks: [
        {time: '09:00-10:30', activity: 'Review concepts', topic: progress?.weakTopics?.[idx % (progress.weakTopics.length || 1)] || 'Core topics'},
        {time: '11:00-12:00', activity: 'Practice problems', topic: 'Mixed exercises'},
        {time: '14:00-15:00', activity: 'Video lectures', topic: 'New module'},
        {time: '16:00-17:00', activity: 'Micro-quiz', topic: 'Daily assessment'}
      ],
      focusArea: progress?.weakTopics?.[idx % (progress.weakTopics.length || 1)] || 'General review'
    })),
    prioritizedTopics: progress?.weakTopics?.slice(0, 5) || ['Fundamentals', 'Core concepts', 'Practice problems'],
    todayTasks: [
      'Complete 1 module',
      'Take 1 practice quiz',
      'Review weak topics for 30 minutes',
      'Earn 100 XP'
    ]
  };
  
  return plan;
}

// Get course recommendations based on progress
router.get('/courses', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    // Get user's completed courses
    const userProgress = await Progress.find({student: payload.sub}).populate('course');
    const completedCourses = userProgress.map(p => p.course?._id);
    
    // Recommend courses they haven't taken
    const recommended = await Course.find({
      _id: {$nin: completedCourses}
    }).limit(5).select('title description level tags');
    
    res.json(recommended);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;
