import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LogOut, Menu, X, ShieldCheck, Users } from 'lucide-react'
import './Navbar.css'

export default function Navbar({ page, setPage }) {
  const { currentUser, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setPage('public')
    setMobileOpen(false)
  }

  const nav = (p) => { setPage(p); setMobileOpen(false) }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="navbar-logo" onClick={() => nav('public')}>
          <span className="logo-icon"><BookOpen size={20} /></span>
          <span className="logo-text">
            <span className="logo-main">Politécnico Los Alpes</span>
            <span className="logo-sub">Pósters Estudiantiles</span>
          </span>
        </button>

        <nav className="navbar-links">
          <button className={`nav-link ${page === 'public' ? 'active' : ''}`} onClick={() => nav('public')}>Proyectos</button>

          {!currentUser && (
            <button className={`nav-link ${page === 'login' ? 'active' : ''}`} onClick={() => nav('login')}>Ingresar</button>
          )}

          {currentUser?.role === 'group' && (
            <button className={`nav-link ${page === 'dashboard' ? 'active' : ''}`} onClick={() => nav('dashboard')}>
              <Users size={15} /> Mi Panel
            </button>
          )}

          {currentUser?.role === 'admin' && (
            <button className={`nav-link ${page === 'admin' ? 'active' : ''}`} onClick={() => nav('admin')}>
              <ShieldCheck size={15} /> Admin
            </button>
          )}

          {currentUser && (
            <div className="nav-user-area">
              <span className="nav-user-badge">{currentUser.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={14} /> Salir
              </button>
            </div>
          )}
        </nav>

        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <button className="mobile-link" onClick={() => nav('public')}>Proyectos</button>
          {!currentUser && <button className="mobile-link" onClick={() => nav('login')}>Ingresar</button>}
          {currentUser?.role === 'group' && <button className="mobile-link" onClick={() => nav('dashboard')}>Mi Panel</button>}
          {currentUser?.role === 'admin' && <button className="mobile-link" onClick={() => nav('admin')}>Administración</button>}
          {currentUser && (
            <button className="mobile-link danger" onClick={handleLogout}>
              <LogOut size={14} /> Cerrar sesión
            </button>
          )}
        </div>
      )}
    </header>
  )
}