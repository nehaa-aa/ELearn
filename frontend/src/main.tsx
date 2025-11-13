// ============================================
// FILE: frontend/src/main.tsx (UPDATED)
// ============================================
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

// ============================================
// FILE: frontend/src/pages/Auth.tsx (UPDATED)
// ============================================
import React, {useState} from 'react';
import api, { setAuthToken } from '../api';

export default function Auth(){
  const [isLogin,setIsLogin]=useState(true);
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [role,setRole]=useState('student');
  
  async function submit(e:any){
    e.preventDefault();
    try{
      if(isLogin){
        const res = await api.post('/api/auth/login', { email, password });
        const token = res.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthToken(token);
        window.location.href = '/dashboard';
      } else {
        const res = await api.post('/api/auth/register', { name, email, password, role });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthToken(res.data.token);
        window.location.href = '/dashboard';
      }
    }catch(err:any){ alert(err?.response?.data?.message || err.message); }
  }
  
  return (
    <div className="page">
      <div className="card" style={{maxWidth:450, margin:'100px auto'}}>
        <div style={{textAlign:'center', marginBottom:30}}>
          <h1 style={{fontSize:36, margin:0, background:'linear-gradient(90deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
            AI E-Learn
          </h1>
          <div style={{fontSize:14, color:'#9fb', marginTop:8}}>Next-generation learning platform</div>
        </div>
        
        <form onSubmit={submit}>
          {!isLogin && (
            <>
              <input 
                placeholder="Full Name" 
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required
              />
              <select 
                value={role} 
                onChange={e=>setRole(e.target.value)}
                style={{width:'100%', padding:10, marginTop:8, borderRadius:8, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', color:'#dff3ff'}}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}
          
          <input 
            type="email"
            placeholder="Email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
          />
          
          <div style={{marginTop:20}}>
            <button type="submit" style={{width:'100%', padding:12, fontSize:16}}>
              {isLogin?'Sign In':'Create Account'}
            </button>
            
            <div style={{textAlign:'center', marginTop:15}}>
              <button 
                type="button" 
                onClick={()=>setIsLogin(!isLogin)} 
                style={{background:'transparent', color:'#7be5ff', padding:'8px 0'}}
              >
                {isLogin?'Need an account? Sign up':'Have an account? Sign in'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// FILE: frontend/src/pages/Dashboard.tsx (ENHANCED)
// ============================================
import React, {useEffect, useState} from 'react';
import api, { setAuthToken } from '../api';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const [user,setUser]=useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  useEffect(()=>{
    const t = localStorage.getItem('token');
    if(!t) { window.location.href='/auth'; return; }
    setAuthToken(t);
    
    api.get('/api/auth/me').then(r=>{
      setUser(r.data);
      localStorage.setItem('user', JSON.stringify(r.data));
    }).catch(()=>{ 
      localStorage.removeItem('token'); 
      window.location.href='/auth'; 
    });
    
    // Load stats
    api.get('/api/leaderboard/me').then(r=>setStats(r.data)).catch(()=>{});
    api.get('/api/recommendations/courses').then(r=>setRecommendations(r.data)).catch(()=>{});
  },[]);
  
  if(!user) return <div className="page"><div className="card">Loading...</div></div>;
  
  return (
    <div className="page">
      <div className="card">
        <h2>Welcome back, {user.name}!</h2>
        <div style={{fontSize:14, color:'#9fb', marginTop:5}}>
          {user.role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
        </div>
        
        {stats && (
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:15, marginTop:30}}>
            <div style={{padding:20, background:'linear-gradient(135deg, rgba(7,182,212,0.1), rgba(7,182,212,0.05))', borderRadius:8, border:'1px solid rgba(7,182,212,0.2)'}}>
              <div style={{fontSize:13, color:'#7be5ff'}}>Total XP</div>
              <div style={{fontSize:32, fontWeight:'bold', marginTop:5}}>{stats.xp || 0}</div>
            </div>
            
            <div style={{padding:20, background:'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', borderRadius:8, border:'1px solid rgba(139,92,246,0.2)'}}>
              <div style={{fontSize:13, color:'#a78bfa'}}>Level</div>
              <div style={{fontSize:32, fontWeight:'bold', marginTop:5}}>{stats.level || 1}</div>
            </div>
            
            <div style={{padding:20, background:'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)'}}>
              <div style={{fontSize:13, color:'#4ade80'}}>Rank</div>
              <div style={{fontSize:32, fontWeight:'bold', marginTop:5}}>#{stats.rank || '-'}</div>
            </div>
            
            <div style={{padding:20, background:'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.05))', borderRadius:8, border:'1px solid rgba(251,191,36,0.2)'}}>
              <div style={{fontSize:13, color:'#fbbf24'}}>Badges</div>
              <div style={{fontSize:32, fontWeight:'bold', marginTop:5}}>{stats.badges?.length || 0}</div>
            </div>
          </div>
        )}
        
        <div style={{marginTop:40}}>
          <h3>Quick Actions</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:15, marginTop:15}}>
            <Link to="/courses" style={{textDecoration:'none'}}>
              <div style={{padding:20, background:'rgba(255,255,255,0.03)', borderRadius:8, textAlign:'center', cursor:'pointer', transition:'all 0.2s', border:'1px solid transparent'}}
                   className="hover-card">
                <div style={{fontSize:40}}>📚</div>
                <div style={{marginTop:10, fontWeight:'bold'}}>Browse Courses</div>
              </div>
            </Link>
            
            <Link to="/ai-tutor" style={{textDecoration:'none'}}>
              <div style={{padding:20, background:'rgba(255,255,255,0.03)', borderRadius:8, textAlign:'center', cursor:'pointer'}}>
                <div style={{fontSize:40}}>🤖</div>
                <div style={{marginTop:10, fontWeight:'bold'}}>AI Tutor</div>
              </div>
            </Link>
            
            <Link to="/leaderboard" style={{textDecoration:'none'}}>
              <div style={{padding:20, background:'rgba(255,255,255,0.03)', borderRadius:8, textAlign:'center', cursor:'pointer'}}>
                <div style={{fontSize:40}}>🏆</div>
                <div style={{marginTop:10, fontWeight:'bold'}}>Leaderboard</div>
              </div>
            </Link>
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div style={{marginTop:40}}>
            <h3>Recommended for You</h3>
            <div style={{marginTop:15}}>
              {recommendations.slice(0,3).map(course=>(
                <Link key={course._id} to={`/courses/${course._id}`} style={{textDecoration:'none'}}>
                  <div style={{padding:15, background:'rgba(255,255,255,0.02)', borderRadius:8, marginBottom:10}}>
                    <strong>{course.title}</strong>
                    <div style={{fontSize:13, color:'#9fb', marginTop:4}}>{course.description}</div>
                    <div style={{fontSize:12, color:'#7be5ff', marginTop:6}}>Level: {course.level}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}