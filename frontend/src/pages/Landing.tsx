// ============================================
// FILE: frontend/src/pages/Landing.tsx
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing(){
  return (
    <div style={{minHeight:'100vh'}}>
      {/* Hero Section */}
      <section style={{
        padding:'80px 20px',
        textAlign:'center',
        background:'linear-gradient(135deg, rgba(7,182,212,0.1), rgba(139,92,246,0.1))',
        borderRadius:20,
        margin:'20px auto',
        maxWidth:1200
      }}>
        <h1 style={{
          fontSize:64,
          fontWeight:700,
          margin:0,
          background:'linear-gradient(90deg, #06b6d4, #8b5cf6)',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          backgroundClip:'text'
        }}>
          AI E-Learn Platform
        </h1>
        <p style={{
          fontSize:24,
          color:'#9fb',
          marginTop:20,
          maxWidth:700,
          margin:'20px auto'
        }}>
          Transform your learning journey with AI-powered personalized education, 
          smart recommendations, and gamified progress tracking
        </p>
        
        <div style={{marginTop:40, display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap'}}>
          <Link to="/auth?role=student" style={{textDecoration:'none'}}>
            <button style={{
              padding:'16px 40px',
              fontSize:18,
              background:'linear-gradient(135deg, #06b6d4, #0891b2)',
              color:'#001',
              fontWeight:700
            }}>
              Start Learning
            </button>
          </Link>
          
          <Link to="/auth?role=teacher" style={{textDecoration:'none'}}>
            <button style={{
              padding:'16px 40px',
              fontSize:18,
              background:'rgba(255,255,255,0.05)',
              color:'#dff3ff',
              border:'2px solid rgba(7,182,212,0.3)'
            }}>
              Teach a Course
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{padding:'80px 20px', maxWidth:1200, margin:'0 auto'}}>
        <h2 style={{textAlign:'center', fontSize:42, marginBottom:60}}>Why Choose AI E-Learn?</h2>
        
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:30}}>
          <div className="card hover-card" style={{textAlign:'center', padding:40}}>
            <div style={{fontSize:60, marginBottom:20}}>🤖</div>
            <h3 style={{fontSize:24, marginTop:0}}>AI-Powered Tutor</h3>
            <p style={{color:'#9fb', lineHeight:1.6}}>
              Get instant help from our intelligent AI tutor that understands your learning style 
              and provides personalized explanations
            </p>
          </div>

          <div className="card hover-card" style={{textAlign:'center', padding:40}}>
            <div style={{fontSize:60, marginBottom:20}}>📊</div>
            <h3 style={{fontSize:24, marginTop:0}}>Smart Analytics</h3>
            <p style={{color:'#9fb', lineHeight:1.6}}>
              Track your progress with detailed analytics, learning curves, and performance 
              insights to optimize your study strategy
            </p>
          </div>

          <div className="card hover-card" style={{textAlign:'center', padding:40}}>
            <div style={{fontSize:60, marginBottom:20}}>🎯</div>
            <h3 style={{fontSize:24, marginTop:0}}>Personalized Plans</h3>
            <p style={{color:'#9fb', lineHeight:1.6}}>
              Receive custom 7-day study schedules tailored to your goals, weak topics, 
              and exam dates for maximum efficiency
            </p>
          </div>

          <div className="card hover-card" style={{textAlign:'center', padding:40}}>
            <div style={{fontSize:60, marginBottom:20}}>🏆</div>
            <h3 style={{fontSize:24, marginTop:0}}>Gamification</h3>
            <p style={{color:'#9fb', lineHeight:1.6}}>
              Earn XP, unlock badges, climb leaderboards, and compete with peers 
              to make learning engaging and fun
            </p>
          </div>

          <div className="card hover-card" style={{textAlign:'center', padding:40}}>
            <div style={{fontSize:60, marginBottom:20}}>📚</div>
            <h3 style={{fontSize:24, marginTop:0}}>Quality Content</h3>
            <p style={{color:'#9fb', lineHeight:1.6}}>
              Access courses from AI, ML, Web Development, Data Science to advanced 
              topics taught by expert instructors
            </p>
          </div>

          <div className="card hover-card" style={{textAlign:'center', padding:40}}>
            <div style={{fontSize:60, marginBottom:20}}>⚡</div>
            <h3 style={{fontSize:24, marginTop:0}}>Instant Feedback</h3>
            <p style={{color:'#9fb', lineHeight:1.6}}>
              Get immediate quiz results with AI-powered explanations to understand 
              your mistakes and improve faster
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding:'60px 20px',
        background:'rgba(7,182,212,0.05)',
        borderRadius:20,
        maxWidth:1200,
        margin:'40px auto'
      }}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:40, textAlign:'center'}}>
          <div>
            <div style={{fontSize:48, fontWeight:700, color:'#06b6d4'}}>5,000+</div>
            <div style={{fontSize:16, color:'#9fb', marginTop:8}}>Active Students</div>
          </div>
          <div>
            <div style={{fontSize:48, fontWeight:700, color:'#8b5cf6'}}>50+</div>
            <div style={{fontSize:16, color:'#9fb', marginTop:8}}>Expert Teachers</div>
          </div>
          <div>
            <div style={{fontSize:48, fontWeight:700, color:'#22c55e'}}>100+</div>
            <div style={{fontSize:16, color:'#9fb', marginTop:8}}>Quality Courses</div>
          </div>
          <div>
            <div style={{fontSize:48, fontWeight:700, color:'#fbbf24'}}>95%</div>
            <div style={{fontSize:16, color:'#9fb', marginTop:8}}>Success Rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding:'80px 20px', textAlign:'center', maxWidth:800, margin:'0 auto'}}>
        <h2 style={{fontSize:42, marginBottom:20}}>Ready to Start Learning?</h2>
        <p style={{fontSize:18, color:'#9fb', marginBottom:40}}>
          Join thousands of learners who are transforming their careers with AI-powered education
        </p>
        
        <div style={{display:'flex', gap:20, justifyContent:'center', flexWrap:'wrap'}}>
          <Link to="/auth?role=student" style={{textDecoration:'none'}}>
            <button style={{
              padding:'16px 40px',
              fontSize:18,
              background:'linear-gradient(135deg, #06b6d4, #0891b2)',
              color:'#001',
              fontWeight:700
            }}>
              Get Started Free
            </button>
          </Link>
          
          <Link to="/courses" style={{textDecoration:'none'}}>
            <button style={{
              padding:'16px 40px',
              fontSize:18,
              background:'rgba(255,255,255,0.05)',
              color:'#dff3ff',
              border:'2px solid rgba(7,182,212,0.3)'
            }}>
              Browse Courses
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding:'40px 20px',
        textAlign:'center',
        borderTop:'1px solid rgba(255,255,255,0.1)',
        marginTop:80
      }}>
        <p style={{color:'#9fb', fontSize:14}}>
          © 2025 AI E-Learn. Built with AI-powered technology for the future of education.
        </p>
      </footer>
    </div>
  );
}