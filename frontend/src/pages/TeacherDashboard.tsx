import React, {useState, useEffect} from 'react';
import api from '../api';

export default function TeacherDashboard(){
  const [courses, setCourses] = useState<any[]>([]);
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('beginner');
  
  useEffect(()=>{
    api.get('/api/courses').then(r=>setCourses(r.data.filter((c:any)=>c.teacher))).catch(()=>{});
  },[]);
  
  async function createCourse(e:any){
    e.preventDefault();
    try{
      const modules = [{title: 'Introduction', content: 'Welcome to the course', contentType: 'article', order: 1}];
      await api.post('/api/courses', {title, description, level, modules});
      alert('Course created successfully!');
      setShowCreateCourse(false);
      window.location.reload();
    }catch(err:any){ alert(err?.response?.data?.message || err.message); }
  }
  
  return (
    <div className="page">
      <div className="card">
        <h2>Teacher Dashboard</h2>
        <div style={{marginTop:20}}>
          <button onClick={()=>setShowCreateCourse(!showCreateCourse)}>
            {showCreateCourse ? 'Cancel' : 'Create New Course'}
          </button>
        </div>
        
        {showCreateCourse && (
          <form onSubmit={createCourse} style={{marginTop:20, padding:20, background:'rgba(0,0,0,0.2)', borderRadius:8}}>
            <h3>New Course</h3>
            <input placeholder="Course Title" value={title} onChange={e=>setTitle(e.target.value)} required />
            <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
            <select value={level} onChange={e=>setLevel(e.target.value)} style={{width:'100%', padding:10, marginTop:8}}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <button type="submit" style={{marginTop:10}}>Create Course</button>
          </form>
        )}
        
        <div style={{marginTop:30}}>
          <h3>Your Courses ({courses.length})</h3>
          {courses.map(c=>(
            <div key={c._id} style={{padding:12, marginTop:10, background:'rgba(255,255,255,0.02)', borderRadius:8}}>
              <strong>{c.title}</strong>
              <div style={{fontSize:13, color:'#9fb', marginTop:4}}>{c.description}</div>
              <div style={{fontSize:12, color:'#7be5ff', marginTop:6}}>Level: {c.level} | Modules: {c.modules?.length || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
