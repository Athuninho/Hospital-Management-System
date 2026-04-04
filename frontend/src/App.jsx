import React from 'react'

function App(){
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">County Hospital HMS</h1>
          <nav className="space-x-3">
            <button onClick={()=>setPage('home')} className="text-sm">Home</button>
            <button onClick={()=>setPage('register')} className="text-sm">Register Patient</button>
            <button onClick={()=>setPage('billing')} className="text-sm">Billing</button>
          </nav>
        </div>
      </header>
      <main className="p-6">
        {page === 'home' && <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow"><p>Welcome to the Hospital Management System prototype.</p></div>}
        {page === 'register' && <PatientRegistration />}
        {page === 'billing' && <BillingPage />}
      </main>
    </div>
  )
}

export default App
