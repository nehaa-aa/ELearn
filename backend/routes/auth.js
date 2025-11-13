
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sign } = require('../utils/jwt');
const router = express.Router();

// register
router.post('/register', async (req,res)=>{
  try{
    const { name, email, password, role } = req.body;
    if(!email||!password||!name) return res.status(400).json({message:'Missing fields'});
    const existing = await User.findOne({email});
    if(existing) return res.status(409).json({message:'Email exists'});
    const hash = await bcrypt.hash(password,10);
    const user = new User({name,email,passwordHash:hash,role: role||'student'});
    await user.save();
    const token = sign(user);
    res.json({token, user:{id:user._id, name:user.name, email:user.email, role:user.role}});
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'}); }
});

// login
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(401).json({message:'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({message:'Invalid credentials'});
    const token = sign(user);
    res.json({token, user:{id:user._id, name:user.name, email:user.email, role:user.role}});
  }catch(e){ console.error(e); res.status(500).json({message:'Server error'}); }
});

// me
const { verify } = require('../utils/jwt');
router.get('/me', async (req,res)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({message:'Unauthorized'});
  const token = auth.split(' ')[1];
  const payload = verify(token);
  if(!payload) return res.status(401).json({message:'Invalid token'});
  const user = await User.findById(payload.sub).select('-passwordHash');
  res.json(user);
});

module.exports = router;
