import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './components/MainLayout';
import Templates from './pages/Templates';
import Tasks from './pages/Tasks';
import History from './pages/History';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="templates" element={<Templates />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="history" element={<History />} />
          <Route index element={<Navigate to="tasks" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
