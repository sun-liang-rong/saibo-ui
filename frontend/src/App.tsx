import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loading from './components/Loading';
import GlobalLoading from './components/GlobalLoading';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MainLayout = lazy(() => import('./components/MainLayout'));
const Templates = lazy(() => import('./pages/Templates'));
const Tasks = lazy(() => import('./pages/Tasks'));
const History = lazy(() => import('./pages/History'));
const DouyinDownloader = lazy(() => import('./pages/DouyinDownloader'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalLoading />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route path="templates" element={<Templates />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="history" element={<History />} />
            <Route path="douyin" element={<DouyinDownloader />} />
            <Route index element={<Navigate to="tasks" replace />} />
          </Route>

          <Route path="/" element={<Navigate to="/templates" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
