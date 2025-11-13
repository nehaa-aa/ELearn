// ============================================
// FILE: frontend/src/pages/Auth.tsx (FIXED)
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
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if(token) {
      setAuthToken(token);
      api.get('/api/auth/me')
        .then(r => {
          // Already authenticated, redirect
          window.location.href = '/dashboard';
        })
        .catch(() => {
          // Invalid token, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
    
    if(roleFromUrl) {
      setRole(roleFromUrl);
      setIsLogin(false);
    }
  }, [roleFromUrl]);
  
  async function submit(e:any){
    e.preventDefault();
    setLoading(true);
    
    try{
      if(isLogin){
        // LOGIN
        const res = await api.post('/api/auth/login', { email, password });
        
        // CRITICAL: Store both token and user data
        const token = res.data.token;
        const user = res.data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // CRITICAL: Set auth token for all future API requests
        setAuthToken(token);
        
        // Small delay to ensure token is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on role
        if(user.role === 'teacher') {
          window.location.href = '/teacher';
        } else if(user.role === 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        // REGISTER
        const res = await api.post('/api/auth/register', { 
          name, 
          email, 
          password, 
          role 
        });
        
        // CRITICAL: Store both token and user data
        const token = res.data.token;
        const user = res.data.user;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // CRITICAL: Set auth token for all future API requests
        setAuthToken(token);
        
        // Small delay to ensure token is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Redirect based on role
        if(role === 'teacher') {
          window.location.href = '/teacher';
        } else if(role === 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      }
    }catch(err:any){ 
      console.error('Auth error:', err);
      const message = err?.response?.data?.message || err.message || 'Authentication failed';
      alert(message);
      setLoading(false);
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
            WebkitTextFillColor:'transparent',
            backgroundClip:'text'
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
              disabled={loading}
            />
          )}
          
          <input 
            type="email"
            placeholder="Email Address" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
            disabled={loading}
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
            minLength={6}
            disabled={loading}
          />
          
          <button 
            type="submit" 
            style={{width:'100%', padding:14, fontSize:16, marginTop:10}}
            disabled={loading}
          >
            {loading ? 'Please wait...' : 
              isLogin ? 'Sign In' : 
              `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account`
            }
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
              disabled={loading}
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
            <div style={{fontWeight:600, marginBottom:8, color:'#7be5ff'}}>Demo Accounts:</div>
            <div style={{marginBottom:4}}>
              <span style={{color:'#9fb'}}>Admin:</span> admin@example.com / password
            </div>
            <div style={{fontSize:12, marginTop:8, color:'rgba(159,255,191,0.6)'}}>
              Or create a new student/teacher account above
            </div>
          </div>
        )}
        
        {/* Security Note for New Users */}
        {!isLogin && (
          <div style={{
            marginTop:20,
            padding:12,
            background:'rgba(7,182,212,0.05)',
            borderRadius:8,
            fontSize:12,
            color:'#9fb',
            border:'1px solid rgba(7,182,212,0.2)'
          }}>
            <div style={{color:'#7be5ff', marginBottom:4}}>🔒 Your account is secure</div>
            Password must be at least 6 characters. Your data is encrypted and protected.
          </div>
        )}
      </div>
    </div>
  );
}