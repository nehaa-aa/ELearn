
import React, {useState} from 'react';
import api, { setAuthToken } from '../api';
export default function Auth(){
  const [isLogin,setIsLogin]=useState(true);
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  async function submit(e:any){ e.preventDefault();
    try{
      if(isLogin){
        const res = await api.post('/api/auth/login', { email, password });
        const token = res.data.token;
        localStorage.setItem('token', token);
        setAuthToken(token);
        window.location.href = '/dashboard';
      } else {
        await api.post('/api/auth/register', { name, email, password });
        alert('Registered. Please login.');
        setIsLogin(true);
      }
    }catch(err:any){ alert(err?.response?.data?.message || err.message); }
  }
  return (<div className="page"><div className="card"><h2>AI E-Learn</h2><form onSubmit={submit}><input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{display:isLogin?'none':'block'}} /><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /><div style={{marginTop:10}}><button type="submit">{isLogin?'Login':'Register'}</button><button type="button" onClick={()=>setIsLogin(!isLogin)} style={{marginLeft:8}}>{isLogin?'Switch to Register':'Switch to Login'}</button></div></form></div></div>);
}
