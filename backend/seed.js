
require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_elearn';

async function seed(){
  await connectDB(MONGO);
  const adminEmail = 'admin@example.com';
  let admin = await User.findOne({email:adminEmail});
  if(!admin){
    const hash = await bcrypt.hash('password',10);
    admin = new User({name:'Admin', email:adminEmail, passwordHash:hash, role:'admin'});
    await admin.save();
    console.log('Created admin user:', adminEmail);
  }
  // sample course
  const c = await Course.findOne({title:'Intro to AI'});
  if(!c){
    await Course.create({title:'Intro to AI', description:'Basics of AI', level:'beginner', modules:[{title:'What is AI?', content:'AI is ...', contentType:'article', order:1}]});
    console.log('Created sample course');
  }
  process.exit();
}
seed();
