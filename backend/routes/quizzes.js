
const express = require('express');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const { verify } = require('../utils/jwt');
const router = express.Router();

// create quiz (teacher)
router.post('/', async (req,res)=>{
  const auth=req.headers.authorization; const token=auth?.split(' ')[1]; const payload=verify(token);
  if(!payload) return res.status(401).json({message:'Unauthorized'});
  if(payload.role!=='teacher' && payload.role!=='admin') return res.status(403).json({message:'Forbidden'});
  const quiz = new Quiz(req.body);
  await quiz.save();
  res.json(quiz);
});

// get quiz
router.get('/:id', async (req,res)=>{
  const q = await Quiz.findById(req.params.id);
  if(!q) return res.status(404).json({message:'Not found'});
  res.json(q);
});

// submit attempt (student)
router.post('/:id/attempt', async (req,res)=>{
  try{
    const auth=req.headers.authorization; const token=auth?.split(' ')[1]; const payload=verify(token);
    if(!payload) return res.status(401).json({message:'Unauthorized'});
    const quiz = await Quiz.findById(req.params.id);
    if(!quiz) return res.status(404).json({message:'Quiz not found'});
    const answers = req.body.answers || {};
    // simple grading for MCQ: count correct choices
    let score = 0; let total = quiz.questions.length;
    quiz.questions.forEach((q,i)=>{
      const a = answers[i];
      if(q.type==='mcq' && a!=null){
        if(String(q.answer) === String(a)) score++;
      }
    });
    const percent = Math.round(score/total*100);
    const attempt = new Attempt({ user: payload.sub, quiz: quiz._id, answers, score: percent });
    await attempt.save();
    res.json({ attempt, score: percent });
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'}); }
});

module.exports = router;
