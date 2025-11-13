const express = require('express');
const router = express.Router();
const { verify } = require('../utils/jwt');
const mongoose = require('mongoose');

// Create Enrollment model
const EnrollmentSchema = new mongoose.Schema({
  student: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  course: {type: mongoose.Schema.Types.ObjectId, ref:'Course', required:true},
  enrolledAt: {type: Date, default: Date.now},
  status: {type: String, enum:['active','completed','dropped'], default:'active'}
});

EnrollmentSchema.index({student:1, course:1}, {unique:true});
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

// Enroll in a course
router.post('/enroll/:courseId', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    const courseId = req.params.courseId;
    
    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: payload.sub,
      course: courseId
    });
    
    if(existing) {
      return res.status(409).json({message:'Already enrolled in this course'});
    }
    
    // Create enrollment
    const enrollment = new Enrollment({
      student: payload.sub,
      course: courseId
    });
    
    await enrollment.save();
    
    res.json({
      message: 'Successfully enrolled',
      enrollment
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

// Get user's enrollments
router.get('/my-enrollments', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    const enrollments = await Enrollment.find({student: payload.sub})
      .populate('course', 'title description level tags')
      .sort({enrolledAt: -1});
    
    res.json(enrollments);
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

// Check if enrolled in a specific course
router.get('/check/:courseId', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    const enrollment = await Enrollment.findOne({
      student: payload.sub,
      course: req.params.courseId
    });
    
    res.json({
      enrolled: !!enrollment,
      enrollment
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

// Unenroll from a course
router.delete('/unenroll/:courseId', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message:'Unauthorized'});
    
    const token = auth.split(' ')[1];
    const payload = verify(token);
    if(!payload) return res.status(401).json({message:'Invalid token'});
    
    await Enrollment.deleteOne({
      student: payload.sub,
      course: req.params.courseId
    });
    
    res.json({message: 'Successfully unenrolled'});
  } catch(e) {
    console.error(e);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;