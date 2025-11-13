import React, {useState} from 'react';
import api from '../api';

export default function LearningPlan(){
  const [plan, setPlan] = useState<any>(null);
  const [examDate, setExamDate] = useState('');
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function generatePlan(e:any){
    e.preventDefault();
    setLoading(true);
    try{
      const res = await api.post('/api/recommendations/learning-plan', {courseId, examDate});
      setPlan(res.data);
    }catch(err:any){ alert(err?.response?.data?.message || err.message); }
    setLoading(false);
  }
  
  return (
    <div className="page">
      <div className="card">
        <h2>Personalized Learning Plan</h2>
        
        {!plan ? (
          <form onSubmit={generatePlan} style={{marginTop:20}}>
            <input placeholder="Course ID" value={courseId} onChange={e=>setCourseId(e.target.value)} required />
            <input type="date" placeholder="Exam Date" value={examDate} onChange={e=>setExamDate(e.target.value)} />
            <button type="submit" disabled={loading} style={{marginTop:10}}>
              {loading ? 'Generating...' : 'Generate Plan'}
            </button>
          </form>
        ) : (
          <div style={{marginTop:20}}>
            <div style={{padding:15, background:'rgba(7,182,212,0.1)', borderRadius:8, marginBottom:20}}>
              <div style={{fontSize:18, fontWeight:'bold'}}>{plan.weeklyGoal}</div>
              <div style={{marginTop:5}}>{plan.motivationalMessage}</div>
              <div style={{marginTop:10, fontSize:13, color:'#7be5ff'}}>
                Days until exam: {plan.daysUntilExam}
              </div>
            </div>
            
            <h3>Today's Tasks</h3>
            <ul style={{marginLeft:20}}>
              {plan.todayTasks?.map((task:string, idx:number)=>(
                <li key={idx} style={{marginTop:8}}>{task}</li>
              ))}
            </ul>
            
            <h3 style={{marginTop:30}}>7-Day Schedule</h3>
            {plan.dailySchedule?.map((day:any, idx:number)=>(
              <div key={idx} style={{marginTop:15, padding:15, background:'rgba(255,255,255,0.02)', borderRadius:8}}>
                <div style={{fontWeight:'bold', marginBottom:10}}>{day.day}</div>
                <div style={{fontSize:13, color:'#7be5ff', marginBottom:10}}>Focus: {day.focusArea}</div>
                {day.tasks.map((task:any, tIdx:number)=>(
                  <div key={tIdx} style={{marginTop:6, fontSize:13}}>
                    <span style={{color:'#9fb'}}>{task.time}</span> - {task.activity} ({task.topic})
                  </div>
                ))}
              </div>
            ))}
            
            <button onClick={()=>setPlan(null)} style={{marginTop:20}}>Generate New Plan</button>
          </div>
        )}
      </div>
    </div>
  );
}