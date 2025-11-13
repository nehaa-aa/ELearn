import React, {useState} from 'react';
import api from '../api';

export default function AITutor(){
  const [messages, setMessages] = useState<any[]>([
    {role:'assistant', content:'Hello! I am your AI tutor. Ask me anything about your courses.'}
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  async function sendMessage(e:any){
    e.preventDefault();
    if(!input.trim()) return;
    
    const userMessage = {role:'user', content:input};
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    try{
      const res = await api.post('/api/ai/chat', {message:input});
      setMessages(prev => [...prev, {role:'assistant', content:res.data.reply}]);
    }catch(err){
      setMessages(prev => [...prev, {role:'assistant', content:'Sorry, I encountered an error. Please try again.'}]);
    }
    setLoading(false);
  }
  
  return (
    <div className="page">
      <div className="card">
        <h2>AI Tutor</h2>
        <div style={{height:400, overflowY:'auto', padding:10, background:'rgba(0,0,0,0.2)', borderRadius:8, marginTop:20}}>
          {messages.map((msg,idx)=>(
            <div key={idx} style={{marginBottom:15, textAlign: msg.role==='user'?'right':'left'}}>
              <div style={{
                display:'inline-block',
                padding:'10px 15px',
                borderRadius:12,
                background: msg.role==='user' ? 'rgba(7,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                maxWidth:'70%',
                textAlign:'left'
              }}>
                <div style={{fontSize:11, color:'#7be5ff', marginBottom:4}}>
                  {msg.role==='user'?'You':'AI Tutor'}
                </div>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div style={{textAlign:'center', color:'#7be5ff'}}>Thinking...</div>}
        </div>
        
        <form onSubmit={sendMessage} style={{marginTop:15, display:'flex', gap:10}}>
          <input 
            placeholder="Ask a question..." 
            value={input} 
            onChange={e=>setInput(e.target.value)}
            style={{flex:1}}
          />
          <button type="submit" disabled={loading}>Send</button>
        </form>
      </div>
    </div>
  );
}
