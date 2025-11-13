
import React, {useEffect, useState} from 'react';
import api, { setAuthToken } from '../api';
export default function Dashboard(){
  const [user,setUser]=useState<any>(null);
  useEffect(()=>{
    const t = localStorage.getItem('token');
    if(!t) { window.location.href='/auth'; return; }
    setAuthToken(t);
    api.get('/api/auth/me').then(r=>setUser(r.data)).catch(()=>{ localStorage.removeItem('token'); window.location.href='/auth'; });
  },[]);
  return (<div className="page"><div className="card"><h2>Dashboard</h2>{user? <div>Welcome, {user.name} ({user.role})</div>:<div>Loading...</div>}<div style={{marginTop:20}}><a href="/courses">Browse Courses</a></div></div></div>);
}
