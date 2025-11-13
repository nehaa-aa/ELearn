require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import all routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const quizRoutes = require('./routes/quizzes');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const progressRoutes = require('./routes/progress');
const recommendationRoutes = require('./routes/recommendation');
const leaderboardRoutes = require('./routes/leaderboard');
const enrollmentRoutes = require('./routes/enrollment');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || process.env.MONGO || 'mongodb://127.0.0.1:27017/ai_elearn';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB(MONGO)
  .then(() => { 
    console.log('✅ Connected to MongoDB'); 
  })
  .catch(e => { 
    console.error('❌ Mongo connection error:', e); 
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/enrollment', enrollmentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'AI E-Learn API Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      quizzes: '/api/quizzes',
      ai: '/api/ai',
      analytics: '/api/analytics',
      progress: '/api/progress',
      recommendations: '/api/recommendations',
      leaderboard: '/api/leaderboard',
      enrollment: '/api/enrollment'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});