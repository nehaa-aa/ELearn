import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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

function Navbar(){
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href='/auth';
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
        <Link to="/ai-tutor">AI Tutor</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/learning-plan">My Plan</Link>
      </div>
      <div style={{display:'flex', gap:15, alignItems:'center'}}>
        <span style={{fontSize:13, color:'#9fb'}}>{user.name} ({user.role})</span>
        <button onClick={logout} style={{padding:'6px 12px', fontSize:13}}>Logout</button>
      </div>
    </nav>
  );
}

function App(){
  return (
    <BrowserRouter>
      <div style={{maxWidth:1200, margin:'0 auto', padding:20}}>
        <Navbar />
        <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/courses" element={<Courses/>} />
          <Route path="/courses/:id" element={<CoursePage/>} />
          <Route path="/teacher" element={<TeacherDashboard/>} />
          <Route path="/ai-tutor" element={<AITutor/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/analytics" element={<Analytics/>} />
          <Route path="/quiz/:id" element={<QuizPage/>} />
          <Route path="/learning-plan" element={<LearningPlan/>} />
          <Route path="*" element={<Navigate to='/auth' />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);