import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; 
import PrivateRoute from '../components/PrivateRoute'; 

const HomePage = lazy(() => import('../pages/Home/Home'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));
const Diary = lazy(() => import('../pages/Diary/Diary'));
const Calculator = lazy(() => import('../pages/Calculator/Calculator'));

function App() {
  return (
    <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/diary" 
              element={
                <PrivateRoute>
                  <Diary />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/calculator" 
              element={
                <PrivateRoute>
                  <Calculator />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Suspense>
    </AuthProvider>
  );
}

export default App;

