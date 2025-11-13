
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const quizRoutes = require('./routes/quizzes');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || process.env.MONGO || 'mongodb://127.0.0.1:27017/ai_elearn';

app.use(cors());
app.use(bodyParser.json());

connectDB(MONGO).then(()=>{ console.log('✅ Connected to MongoDB'); }).catch(e=>{ console.error('Mongo connection error',e); });

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req,res)=> res.send('AI E-Learn API Running'));

app.listen(PORT, ()=> console.log(`Server listening on http://localhost:${PORT}`));
