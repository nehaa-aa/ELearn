
import React, {useEffect,useState} from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
export default function CoursePage(){
  const { id } = useParams();
  const [course,setCourse]=useState<any>(null);
  useEffect(()=>{ if(id) api.get('/api/courses/'+id).then(r=>setCourse(r.data)).catch(()=>{}); },[id]);
  return (<div className="page"><div className="card">{course? <div><h2>{course.title}</h2><div>{course.description}</div><h3>Modules</h3>{course.modules.map((m:any,i:number)=>(<div key={i} style={{padding:6,borderTop:'1px solid #233'}}><strong>{m.title}</strong><div style={{fontSize:13,color:'#9fb'}}>{m.contentType}</div></div>))}</div>:<div>Loading...</div>}</div></div>);
}
