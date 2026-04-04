import React from 'react'

export default function Modal({ show, title, children, onCancel, onConfirm }){
  if (!show) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow max-w-lg w-full">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onCancel} className="text-gray-500">✕</button>
        </div>
        <div>{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-blue-600 text-white rounded">Confirm</button>
        </div>
      </div>
    </div>
  )
}
