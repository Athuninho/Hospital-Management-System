import React, { useEffect } from 'react'

export default function Toast({ message, type='info', onClose }){
  useEffect(()=>{ if (!message) return; const t=setTimeout(()=>onClose && onClose(), 3500); return ()=>clearTimeout(t) }, [message])
  if (!message) return null
  const bg = type === 'error' ? 'bg-red-100' : (type === 'success' ? 'bg-green-100' : 'bg-yellow-100')
  return (
    <div className={`fixed top-4 right-4 shadow p-3 rounded ${bg}`}>
      <div>{message}</div>
    </div>
  )
}
