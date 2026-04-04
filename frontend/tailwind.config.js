/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0369a1', // Premium hospital blue
        secondary: '#f8fafc',
        accent: '#38bdf8',
        danger: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        'dark-bg': '#0f172a',
        'dark-panel': '#1e293b'
      }
    },
  },
  plugins: [],
}
