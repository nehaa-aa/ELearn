import React, {useEffect,useState} from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';

export default function CoursePage(){
  const { id } = useParams();
  const [course,setCourse]=useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  useEffect(()=>{ 
    if(id) {
      // Load course details
      api.get('/api/courses/'+id).then(r=>setCourse(r.data)).catch(()=>{});
      
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if(token) {
        // Check enrollment status
        api.get('/api/enrollment/check/'+id)
          .then(r=>setIsEnrolled(r.data.enrolled))
          .catch(()=>{})
          .finally(()=>setCheckingAuth(false));
        
        // Load progress if enrolled
        api.get('/api/progress/course/'+id)
          .then(r=>setProgress(r.data))
          .catch(()=>{});
      } else {
        setCheckingAuth(false);
      }
    }
  },[id]);
  
  async function handleEnroll(){
    const token = localStorage.getItem('token');
    if(!token) {
      alert('Please login first');
      window.location.href='/auth';
      return;
    }
    
    setEnrolling(true);
    try{
      await api.post('/api/enrollment/enroll/'+id);
      setIsEnrolled(true);
      alert('Successfully enrolled in this course!');
    }catch(err:any){
      alert(err?.response?.data?.message || 'Failed to enroll');
    }
    setEnrolling(false);
  }
  
  async function handleUnenroll(){
    if(!confirm('Are you sure you want to unenroll from this course?')) return;
    try{
      await api.delete('/api/enrollment/unenroll/'+id);
      setIsEnrolled(false);
      alert('Successfully unenrolled');
    }catch(err:any){
      alert(err?.response?.data?.message || 'Failed to unenroll');
    }
  }
  
  async function markModuleComplete(moduleIndex: number){
    try{
      await api.post('/api/progress/module/complete', {
        courseId: id,
        moduleIndex
      });
      alert('Module completed! +50 XP');
      // Reload progress
      const res = await api.get('/api/progress/course/'+id);
      setProgress(res.data);
    }catch(err:any){
      alert(err?.response?.data?.message || 'Failed to mark complete');
    }
  }
  
  if(!course) return <div className="page"><div className="card">Loading...</div></div>;
  
  const completedModules = progress?.completedModules || [];
  const completionPercentage = course.modules.length > 0 
    ? Math.round((completedModules.length / course.modules.length) * 100)
    : 0;
  
  const isLoggedIn = !!localStorage.getItem('token');
  
  return (
    <div className="page">
      <div className="card">
        {/* Course Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:20, flexWrap:'wrap', gap:20}}>
          <div style={{flex:1, minWidth:300}}>
            <h2>{course.title}</h2>
            <p style={{color:'#9fb', marginTop:8}}>{course.description}</p>
            
            <div style={{display:'flex', gap:10, marginTop:15, flexWrap:'wrap'}}>
              <span className="badge" style={{background:'rgba(139,92,246,0.2)', borderColor:'rgba(139,92,246,0.3)'}}>
                {course.level}
              </span>
              {course.tags?.map((tag:string, i:number)=>(
                <span key={i} className="badge">{tag}</span>
              ))}
            </div>
          </div>
          
          <div style={{marginLeft:20}}>
            {!isLoggedIn ? (
              <button onClick={()=>window.location.href='/auth'}>
                Login to Enroll
              </button>
            ) : !checkingAuth && !isEnrolled ? (
              <button 
                onClick={handleEnroll} 
                disabled={enrolling}
                style={{whiteSpace:'nowrap'}}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            ) : isEnrolled ? (
              <div style={{textAlign:'right'}}>
                <div style={{
                  padding:'12px 20px',
                  background:'rgba(34,197,94,0.2)',
                  borderRadius:8,
                  fontSize:14,
                  color:'#22c55e',
                  marginBottom:10
                }}>
                  ✓ Enrolled
                </div>
                <button 
                  onClick={handleUnenroll}
                  style={{
                    background:'rgba(239,68,68,0.2)',
                    fontSize:13
                  }}
                >
                  Unenroll
                </button>
              </div>
            ) : null}
          </div>
        </div>
        
        {/* Progress Bar */}
        {isEnrolled && (
          <div style={{marginBottom:30}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
              <span style={{fontSize:14, color:'#9fb'}}>Course Progress</span>
              <span style={{fontSize:14, fontWeight:'bold', color:'#7be5ff'}}>
                {completionPercentage}%
              </span>
            </div>
            <div style={{
              height:8,
              background:'rgba(255,255,255,0.1)',
              borderRadius:4,
              overflow:'hidden'
            }}>
              <div style={{
                height:'100%',
                width:`${completionPercentage}%`,
                background:'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                transition:'width 0.3s ease'
              }}></div>
            </div>
          </div>
        )}
        
        {/* Modules */}
        <h3>Course Modules ({course.modules.length})</h3>
        <div style={{marginTop:15}}>
          {course.modules.map((m:any,i:number)=>{
            const isCompleted = completedModules.includes(i);
            
            return (
              <div 
                key={i} 
                className="hover-card"
                style={{
                  padding:20,
                  marginTop:15,
                  background: isCompleted 
                    ? 'rgba(34,197,94,0.1)' 
                    : 'rgba(255,255,255,0.02)',
                  borderRadius:12,
                  border: isCompleted
                    ? '1px solid rgba(34,197,94,0.3)'
                    : '1px solid rgba(255,255,255,0.05)',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  flexWrap:'wrap',
                  gap:15
                }}
              >
                <div style={{flex:1, minWidth:200}}>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <span style={{
                      fontSize:18,
                      fontWeight:'bold',
                      color: isCompleted ? '#22c55e' : '#7be5ff'
                    }}>
                      {isCompleted ? '✓' : i+1}
                    </span>
                    <strong style={{fontSize:16}}>{m.title}</strong>
                  </div>
                  
                  {m.content && (
                    <p style={{
                      fontSize:14,
                      color:'#9fb',
                      marginTop:8,
                      marginLeft:32
                    }}>
                      {m.content.substring(0,100)}...
                    </p>
                  )}
                  
                  <div style={{fontSize:13, color:'#7be5ff', marginTop:8, marginLeft:32}}>
                    Type: {m.contentType}
                  </div>
                </div>
                
                {isEnrolled && !isCompleted && (
                  <button 
                    onClick={()=>markModuleComplete(i)}
                    style={{
                      fontSize:13,
                      padding:'8px 16px'
                    }}
                  >
                    Mark Complete
                  </button>
                )}
                
                {isCompleted && (
                  <span style={{
                    padding:'8px 16px',
                    background:'rgba(34,197,94,0.2)',
                    borderRadius:8,
                    fontSize:13,
                    color:'#22c55e'
                  }}>
                    Completed
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        {!isEnrolled && isLoggedIn && (
          <div style={{
            marginTop:30,
            padding:20,
            background:'rgba(7,182,212,0.1)',
            borderRadius:12,
            textAlign:'center',
            border:'1px solid rgba(7,182,212,0.3)'
          }}>
            <p style={{fontSize:16, marginBottom:15}}>
              Enroll in this course to access all modules and track your progress!
            </p>
            <button onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </div>
        )}
        
        {!isLoggedIn && (
          <div style={{
            marginTop:30,
            padding:20,
            background:'rgba(139,92,246,0.1)',
            borderRadius:12,
            textAlign:'center',
            border:'1px solid rgba(139,92,246,0.3)'
          }}>
            <p style={{fontSize:16, marginBottom:15}}>
              Please login to enroll in this course
            </p>
            <button onClick={()=>window.location.href='/auth'}>
              Login / Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}