
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CoursePage from './pages/CoursePage';
import './styles.css';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/courses" element={<Courses/>} />
        <Route path="/courses/:id" element={<CoursePage/>} />
        <Route path="*" element={<Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
