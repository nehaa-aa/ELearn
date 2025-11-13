// ============================================
// FILE: frontend/src/pages/Auth.tsx (IMPROVED)
// ============================================
import React, {useState, useEffect} from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api, { setAuthToken } from '../api';

export default function Auth(){
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role');
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(roleFromUrl || 'student');
  
  useEffect(() => {
    if(roleFromUrl) {
      setRole(roleFromUrl);
      setIsLogin(false); // Open signup form if role is specified in URL
    }
  }, [roleFromUrl]);
  
  async function submit(e:any){
    e.preventDefault();
    try{
      if(isLogin){
        const res = await api.post('/api/auth/login', { email, password });
        const token = res.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthToken(token);
        
        // Redirect based on role
        if(res.data.user.role === 'teacher') {
          window.location.href = '/teacher';
        } else if(res.data.user.role === 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        const res = await api.post('/api/auth/register', { name, email, password, role });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthToken(res.data.token);
        
        // Redirect based on role
        if(role === 'teacher') {
          window.location.href = '/teacher';
        } else {
          window.location.href = '/dashboard';
        }
      }
    }catch(err:any){ 
      alert(err?.response?.data?.message || err.message); 
    }
  }
  
  return (
    <div className="page">
      <div style={{textAlign:'center', marginBottom:40}}>
        <Link to="/" style={{textDecoration:'none'}}>
          <h1 style={{
            fontSize:36,
            margin:0,
            background:'linear-gradient(90deg, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent'
          }}>
            ← AI E-Learn
          </h1>
        </Link>
      </div>

      <div className="card" style={{maxWidth:500, margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:30}}>
          <h2 style={{fontSize:32, margin:0}}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{color:'#9fb', marginTop:10, fontSize:14}}>
            {isLogin ? 'Sign in to continue learning' : 'Join the future of education'}
          </p>
        </div>

        {/* Role Selection Cards - Only show for signup */}
        {!isLogin && (
          <div style={{marginBottom:30}}>
            <label style={{display:'block', marginBottom:12, fontSize:14, fontWeight:600}}>
              I want to join as:
            </label>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12}}>
              <div
                onClick={() => setRole('student')}
                style={{
                  padding:20,
                  borderRadius:12,
                  border: role==='student' ? '2px solid #06b6d4' : '1px solid rgba(255,255,255,0.1)',
                  background: role==='student' ? 'rgba(7,182,212,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor:'pointer',
                  textAlign:'center',
                  transition:'all 0.2s'
                }}
                className="hover-card"
              >
                <div style={{fontSize:32, marginBottom:8}}>🎓</div>
                <div style={{fontSize:14, fontWeight:600}}>Student</div>
              </div>

              <div
                onClick={() => setRole('teacher')}
                style={{
                  padding:20,
                  borderRadius:12,
                  border: role==='teacher' ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.1)',
                  background: role==='teacher' ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor:'pointer',
                  textAlign:'center',
                  transition:'all 0.2s'
                }}
                className="hover-card"
              >
                <div style={{fontSize:32, marginBottom:8}}>👨‍🏫</div>
                <div style={{fontSize:14, fontWeight:600}}>Teacher</div>
              </div>

              <div
                onClick={() => setRole('admin')}
                style={{
                  padding:20,
                  borderRadius:12,
                  border: role==='admin' ? '2px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                  background: role==='admin' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                  cursor:'pointer',
                  textAlign:'center',
                  transition:'all 0.2s'
                }}
                className="hover-card"
              >
                <div style={{fontSize:32, marginBottom:8}}>⚙️</div>
                <div style={{fontSize:14, fontWeight:600}}>Admin</div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={submit}>
          {!isLogin && (
            <input 
              placeholder="Full Name" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              required
            />
          )}
          
          <input 
            type="email"
            placeholder="Email Address" 
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
            minLength={6}
          />
          
          <button type="submit" style={{width:'100%', padding:14, fontSize:16, marginTop:10}}>
            {isLogin ? 'Sign In' : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`}
          </button>
          
          <div style={{textAlign:'center', marginTop:20}}>
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              style={{
                background:'transparent',
                color:'#7be5ff',
                padding:'8px 0',
                boxShadow:'none'
              }}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>

        {/* Quick Login Info */}
        {isLogin && (
          <div style={{
            marginTop:30,
            padding:15,
            background:'rgba(255,255,255,0.02)',
            borderRadius:8,
            fontSize:13,
            color:'#9fb'
          }}>
            <div style={{fontWeight:600, marginBottom:8}}>Demo Accounts:</div>
            <div>Admin: admin@example.com / password</div>
          </div>
        )}
      </div>
    </div>
  );
}