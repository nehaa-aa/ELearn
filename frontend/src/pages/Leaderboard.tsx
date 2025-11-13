import React, {useEffect, useState} from 'react';
import api from '../api';

export default function Leaderboard(){
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  
  useEffect(()=>{
    api.get('/api/leaderboard').then(r=>setLeaderboard(r.data)).catch(()=>{});
    api.get('/api/leaderboard/me').then(r=>setMyRank(r.data)).catch(()=>{});
  },[]);
  
  return (
    <div className="page">
      <div className="card">
        <h2>Leaderboard</h2>
        
        {myRank && (
          <div style={{padding:15, background:'rgba(7,182,212,0.1)', borderRadius:8, marginTop:20}}>
            <div style={{fontSize:18, fontWeight:'bold'}}>Your Rank: #{myRank.rank}</div>
            <div style={{marginTop:5}}>XP: {myRank.xp} | Level: {myRank.level} | Streak: {myRank.streak} days</div>
            <div style={{marginTop:5}}>Badges: {myRank.badges?.length || 0}</div>
          </div>
        )}
        
        <div style={{marginTop:30}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid rgba(255,255,255,0.1)'}}>
                <th style={{padding:10, textAlign:'left'}}>Rank</th>
                <th style={{padding:10, textAlign:'left'}}>Student</th>
                <th style={{padding:10, textAlign:'right'}}>XP</th>
                <th style={{padding:10, textAlign:'right'}}>Level</th>
                <th style={{padding:10, textAlign:'right'}}>Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry,idx)=>(
                <tr key={idx} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding:10}}>
                    <span style={{
                      display:'inline-block',
                      width:30,
                      height:30,
                      lineHeight:'30px',
                      textAlign:'center',
                      borderRadius:'50%',
                      background: idx<3 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                      fontWeight:'bold'
                    }}>
                      {entry.rank}
                    </span>
                  </td>
                  <td style={{padding:10}}>{entry.name}</td>
                  <td style={{padding:10, textAlign:'right', color:'#7be5ff'}}>{entry.xp}</td>
                  <td style={{padding:10, textAlign:'right'}}>{entry.level}</td>
                  <td style={{padding:10, textAlign:'right'}}>{entry.badges}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}