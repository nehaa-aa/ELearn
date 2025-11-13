import React, {useEffect, useState} from 'react';
import api from '../api';

export default function Analytics(){
  const [learningCurve, setLearningCurve] = useState<any[]>([]);
  
  useEffect(()=>{
    api.get('/api/analytics/learning-curve').then(r=>setLearningCurve(r.data)).catch(()=>{});
  },[]);
  
  return (
    <div className="page">
      <div className="card">
        <h2>Learning Analytics</h2>
        
        <div style={{marginTop:30}}>
          <h3>Learning Curve (Last 14 Days)</h3>
          <div style={{height:300, background:'rgba(0,0,0,0.2)', borderRadius:8, padding:20, marginTop:15}}>
            {learningCurve.length > 0 ? (
              <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-around', height:'100%'}}>
                {learningCurve.map((point,idx)=>(
                  <div key={idx} style={{textAlign:'center', flex:1}}>
                    <div style={{
                      height: `${point.avgScore * 2}px`,
                      background:'linear-gradient(180deg, #06b6d4, #0891b2)',
                      borderRadius:'4px 4px 0 0',
                      marginBottom:10
                    }}></div>
                    <div style={{fontSize:11, color:'#9fb'}}>{point._id.substring(5)}</div>
                    <div style={{fontSize:13, color:'#7be5ff', marginTop:2}}>{Math.round(point.avgScore)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{textAlign:'center', paddingTop:100, color:'#9fb'}}>No data yet. Complete some quizzes to see your progress!</div>
            )}
          </div>
        </div>
        
        <div style={{marginTop:30, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:15}}>
          <div style={{padding:20, background:'rgba(7,182,212,0.1)', borderRadius:8}}>
            <div style={{fontSize:13, color:'#9fb'}}>Average Score</div>
            <div style={{fontSize:28, fontWeight:'bold', marginTop:5}}>
              {learningCurve.length > 0 
                ? Math.round(learningCurve.reduce((sum,p)=>sum+p.avgScore,0)/learningCurve.length) 
                : 0}%
            </div>
          </div>
          <div style={{padding:20, background:'rgba(139,92,246,0.1)', borderRadius:8}}>
            <div style={{fontSize:13, color:'#9fb'}}>Quizzes Taken</div>
            <div style={{fontSize:28, fontWeight:'bold', marginTop:5}}>{learningCurve.length}</div>
          </div>
          <div style={{padding:20, background:'rgba(34,197,94,0.1)', borderRadius:8}}>
            <div style={{fontSize:13, color:'#9fb'}}>Study Streak</div>
            <div style={{fontSize:28, fontWeight:'bold', marginTop:5}}>5 days</div>
          </div>
        </div>
      </div>
    </div>
  );
}