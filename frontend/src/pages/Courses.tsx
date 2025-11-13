
import React, {useEffect, useState} from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
export default function Courses(){
  const [courses,setCourses]=useState([] as any[]);
  useEffect(()=>{ api.get('/api/courses').then(r=>setCourses(r.data)).catch(()=>{}); },[]);
  return (<div className="page"><div className="card"><h2>Courses</h2>{courses.map(c=> (<div key={c._id} style={{padding:8,borderBottom:'1px solid #233'}}><Link to={'/courses/'+c._id}>{c.title}</Link><div style={{fontSize:13,color:'#9fb'}}>{c.description}</div></div>))}</div></div>);
}
