import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BillingDashboard from './pages/BillingDashboard';
import PatientRegistration from './pages/PatientRegistration';
import PharmacyStock from './pages/PharmacyStock';
import Laboratory from './pages/Laboratory';
import InpatientWards from './pages/InpatientWards';
import AppointmentQueue from './pages/AppointmentQueue';
import Login from './pages/Login';
import Register from './pages/Register';
import auth from './services/auth';
import './index.css';

function RoleHome({ role }) {
  // choose a landing page per role
  if (role === 'billing') return <BillingDashboard />;
  if (role === 'pharmacy') return <PharmacyStock />;
  if (role === 'lab') return <Laboratory />;
  if (role === 'nurse' || role === 'doctor') return <Dashboard />;
  return <Dashboard />; // default
}

function App() {
  const [user, setUser] = useState(() => auth.getUserFromToken());

  useEffect(() => {
    const onStorage = () => setUser(auth.getUserFromToken());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isAuth = !!user;

  if (!isAuth) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<RoleHome role={user.role} />} />
          <Route path="/billing" element={<BillingDashboard />} />
          <Route path="/patients" element={<PatientRegistration />} />
          <Route path="/pharmacy" element={<PharmacyStock />} />
          <Route path="/lab" element={<Laboratory />} />
          <Route path="/wards" element={<InpatientWards />} />
          <Route path="/queue" element={<AppointmentQueue />} />
          <Route path="*" element={<RoleHome role={user.role} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
