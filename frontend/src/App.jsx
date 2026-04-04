import React from 'react'

function App(){
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Mombasa Hospital </h1>
          <nav className="space-x-3">
            <button onClick={()=>setPage('home')} className="text-sm">Home</button>
            <button onClick={()=>setPage('register')} className="text-sm">Register Patient</button>
            <button onClick={()=>setPage('billing')} className="text-sm">Billing</button>
            <button onClick={()=>setPage('pharmacy')} className="text-sm">Pharmacy</button>
            <button onClick={()=>setPage('lab')} className="text-sm">Lab</button>
          </nav>
        </div>
      </header>
      <main className="p-6">
        {page === 'home' && <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow"><p>Welcome to the Mombasa Hospital.</p></div>}
        {page === 'register' && <PatientRegistration />}
        {page === 'billing' && <BillingPage />}
        {page === 'pharmacy' && <Pharmacy />}
        {page === 'lab' && <Lab />}
      </main>
    </div>
  )
}

export default App
