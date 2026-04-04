import React, { useState } from 'react'
import PatientRegistration from './pages/PatientRegistration'
import BillingPage from './pages/BillingPage'
import Pharmacy from './pages/Pharmacy'
import Lab from './pages/Lab'

function App(){
  const [page, setPage] = useState('home')
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">County Hospital HMS</h1>
          <nav className="space-x-3">
            <button onClick={()=>setPage('home')} className="px-3 py-1">Home</button>
            <button onClick={()=>setPage('register')} className="px-3 py-1">Register Patient</button>
            <button onClick={()=>setPage('billing')} className="px-3 py-1">Billing</button>
            <button onClick={()=>setPage('pharmacy')} className="px-3 py-1">Pharmacy</button>
            <button onClick={()=>setPage('lab')} className="px-3 py-1">Lab</button>
          </nav>
        </div>
      </header>
      <main className="p-6">
        {page === 'home' && <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">Welcome to the Hospital Management System prototype.</div>}
        {page === 'register' && <PatientRegistration />}
        {page === 'billing' && <BillingPage />}
        {page === 'pharmacy' && <Pharmacy />}
        {page === 'lab' && <Lab />}
      </main>
    </div>
  )
}

export default App
