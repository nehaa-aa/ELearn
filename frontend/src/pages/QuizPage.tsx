import React, {useEffect, useState} from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function QuizPage(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  useEffect(()=>{
    if(id) api.get('/api/quizzes/'+id).then(r=>setQuiz(r.data)).catch(()=>{});
  },[id]);
  
  async function submitQuiz(){
    try{
      const res = await api.post(`/api/quizzes/${id}/attempt`, {answers});
      setResult(res.data);
      setSubmitted(true);
    }catch(err:any){ alert(err?.response?.data?.message || err.message); }
  }
  
  if(submitted && result){
    return (
      <div className="page">
        <div className="card" style={{textAlign:'center'}}>
          <h2>Quiz Results</h2>
          <div style={{fontSize:64, fontWeight:'bold', color: result.score>=70?'#22c55e':'#ef4444', marginTop:20}}>
            {result.score}%
          </div>
          <div style={{fontSize:18, marginTop:10}}>
            {result.score>=70 ? 'Great job!' : 'Keep practicing!'}
          </div>
          <div style={{marginTop:30}}>
            <button onClick={()=>navigate('/courses')}>Back to Courses</button>
            <button onClick={()=>window.location.reload()} style={{marginLeft:10}}>Retry Quiz</button>
          </div>
        </div>
      </div>
    );
  }
  
  if(!quiz) return <div className="page"><div className="card">Loading...</div></div>;
  
  return (
    <div className="page">
      <div className="card">
        <h2>{quiz.title}</h2>
        <div style={{fontSize:13, color:'#9fb', marginTop:5}}>Difficulty: {quiz.difficulty} | Questions: {quiz.questions.length}</div>
        
        <div style={{marginTop:30}}>
          {quiz.questions.map((q:any, idx:number)=>(
            <div key={idx} style={{marginBottom:30, padding:15, background:'rgba(255,255,255,0.02)', borderRadius:8}}>
              <div style={{fontWeight:'bold', marginBottom:10}}>Q{idx+1}. {q.question}</div>
              {q.type==='mcq' && q.choices?.map((choice:string, cIdx:number)=>(
                <div key={cIdx} style={{marginTop:8}}>
                  <label style={{display:'flex', alignItems:'center', cursor:'pointer'}}>
                    <input 
                      type="radio" 
                      name={`q${idx}`}
                      value={cIdx}
                      checked={answers[idx]===cIdx}
                      onChange={()=>setAnswers({...answers, [idx]:cIdx})}
                      style={{marginRight:10}}
                    />
                    {choice}
                  </label>
                </div>
              ))}
              {q.type==='short' && (
                <input 
                  placeholder="Your answer"
                  value={answers[idx]||''}
                  onChange={e=>setAnswers({...answers, [idx]:e.target.value})}
                  style={{marginTop:10}}
                />
              )}
            </div>
          ))}
        </div>
        
        <button onClick={submitQuiz} style={{marginTop:20}}>Submit Quiz</button>
      </div>
    </div>
  );
}
