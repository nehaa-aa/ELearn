
const express = require('express');
const Course = require('../models/Course');
const { verify } = require('../utils/jwt');
const router = express.Router();

// list courses
router.get('/', async (req,res)=>{
  const courses = await Course.find().select('-modules.content');
  res.json(courses);
});

// create course (teacher/admin)
router.post('/', async (req,res)=>{
  try{
    const auth = req.headers.authorization; const token = auth?.split(' ')[1]; const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Unauthorized'});
    if(payload.role!=='teacher' && payload.role!=='admin') return res.status(403).json({message:'Forbidden'});
    const { title, description, level, tags, modules } = req.body;
    const course = new Course({ title, description, level, tags, modules, teacher: payload.sub });
    await course.save();
    res.json(course);
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'}); }
});

// get course
router.get('/:id', async (req,res)=>{
  const c = await Course.findById(req.params.id).populate('teacher','name email');
  if(!c) return res.status(404).json({message:'Not found'});
  res.json(c);
});

module.exports = router;
