import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BillingDashboard from './pages/BillingDashboard';
import PatientRegistration from './pages/PatientRegistration';
import PharmacyStock from './pages/PharmacyStock';
import Laboratory from './pages/Laboratory';
import InpatientWards from './pages/InpatientWards';
import AppointmentQueue from './pages/AppointmentQueue';
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
          <Route path="/lab" element={<Laboratory />} />
          <Route path="/wards" element={<InpatientWards />} />
          <Route path="/queue" element={<AppointmentQueue />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
