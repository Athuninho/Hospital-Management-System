import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BillingDashboard from './pages/BillingDashboard';
import PatientRegistration from './pages/PatientRegistration';
import PharmacyStock from './pages/PharmacyStock';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/billing" element={<BillingDashboard />} />
          <Route path="/patients" element={<PatientRegistration />} />
          <Route path="/pharmacy" element={<PharmacyStock />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
