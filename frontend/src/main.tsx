// ============================================
// FILE: frontend/src/main.tsx (UPDATED WITH LANDING)
// ============================================
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import TeacherDashboard from './pages/TeacherDashboard';
import AITutor from './pages/AITutor';
import Leaderboard from './pages/Leaderboard';
import Analytics from './pages/Analytics';
import QuizPage from './pages/QuizPage';
import LearningPlan from './pages/LearningPlan';
import './styles.css';

// Public Navbar (for landing page and auth)
function PublicNavbar(){
  const location = useLocation();
  
  // Don't show navbar on auth page
  if(location.pathname === '/auth') return null;
  
  return (
    <nav style={{
      background:'rgba(0,0,0,0.3)',
      padding:'15px 20px',
      marginBottom:20,
      borderRadius:12,
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      backdropFilter:'blur(10px)'
    }}>
      <Link to="/" style={{textDecoration:'none', fontSize:20, fontWeight:'bold'}}>
        AI E-Learn
      </Link>
      
      <div style={{display:'flex', gap:20, alignItems:'center'}}>
        <Link to="/courses">Courses</Link>
        <Link to="/auth?role=student">
          <button style={{padding:'8px 20px', fontSize:14}}>Sign In</button>
        </Link>
      </div>
    </nav>
  );
}

// Authenticated Navbar (for logged-in users)
function AuthNavbar(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href='/';
  }
  
  if(!user) return null;
  
  return (
    <nav style={{
      background:'rgba(0,0,0,0.3)',
      padding:'15px 20px',
      marginBottom:20,
      borderRadius:12,
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      backdropFilter:'blur(10px)'
    }}>
      <div style={{display:'flex', gap:20, alignItems:'center'}}>
        <Link to="/dashboard" style={{textDecoration:'none', fontSize:18, fontWeight:'bold'}}>
          AI E-Learn
        </Link>
        <Link to="/courses">Courses</Link>
        {user.role==='teacher' && <Link to="/teacher">Teach</Link>}
        {user.role==='admin' && <Link to="/teacher">Manage</Link>}
        <Link to="/ai-tutor">AI Tutor</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/learning-plan">My Plan</Link>
      </div>
      <div style={{display:'flex', gap:15, alignItems:'center'}}>
        <span style={{fontSize:13, color:'#9fb'}}>
          {user.name} 
          <span style={{
            marginLeft:8,
            padding:'2px 8px',
            borderRadius:12,
            fontSize:11,
            background: user.role==='admin' ? 'rgba(34,197,94,0.2)' : user.role==='teacher' ? 'rgba(139,92,246,0.2)' : 'rgba(7,182,212,0.2)',
            color: user.role==='admin' ? '#22c55e' : user.role==='teacher' ? '#a78bfa' : '#7be5ff'
          }}>
            {user.role}
          </span>
        </span>
        <button onClick={logout} style={{padding:'6px 16px', fontSize:13}}>Logout</button>
      </div>
    </nav>
  );
}

// Main App Component
function App(){
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // Determine which navbar to show
  const isPublicRoute = ['/', '/auth', '/courses'].includes(location.pathname) || 
                        location.pathname.startsWith('/courses/');
  
  return (
    <div style={{maxWidth:1200, margin:'0 auto', padding:20}}>
      {user && !isPublicRoute ? <AuthNavbar /> : isPublicRoute && !user ? <PublicNavbar /> : null}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing/>} />
        <Route path="/auth" element={<Auth/>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/courses/:id" element={<CoursePage/>} />
        <Route path="/teacher" element={<TeacherDashboard/>} />
        <Route path="/ai-tutor" element={<AITutor/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/analytics" element={<Analytics/>} />
        <Route path="/quiz/:id" element={<QuizPage/>} />
        <Route path="/learning-plan" element={<LearningPlan/>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);