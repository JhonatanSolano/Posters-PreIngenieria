import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import PublicGallery from './pages/PublicGallery'

function AppContent() {
  const { currentUser } = useAuth()
  const [page, setPage] = useState('public')

  // Guard: redirect if logged in and tries to visit login
  useEffect(() => {
    if (currentUser && page === 'login') {
      setPage(currentUser.role === 'admin' ? 'admin' : 'dashboard')
    }
  }, [currentUser, page])

  // Guard: redirect if not logged in and tries to visit protected pages
  useEffect(() => {
    if (!currentUser && (page === 'dashboard' || page === 'admin')) {
      setPage('login')
    }
  }, [currentUser, page])

  const renderPage = () => {
    switch (page) {
      case 'login':     return <Login setPage={setPage} />
      case 'dashboard': return currentUser?.role === 'group'
                               ? <Dashboard setPage={setPage} />
                               : <Login setPage={setPage} />
      case 'admin':     return currentUser?.role === 'admin'
                               ? <Admin />
                               : <Login setPage={setPage} />
      default:          return <PublicGallery setPage={setPage} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar page={page} setPage={setPage} />
      <main style={{ flex: 1 }}>
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
