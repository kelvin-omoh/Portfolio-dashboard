import { useState } from 'react'
import Dashboard from './components/Dashboard'
import { DashboardProvider } from './contexts/DashboardContext'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <DashboardProvider>
        <div className="min-h-screen theme-transition">
          <Dashboard />
        </div>
      </DashboardProvider>
    </ThemeProvider>
  )
}

export default App
