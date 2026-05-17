import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import './Login.css'

export default function Login({ setPage }) {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Por favor completa todos los campos.'); return }
    setLoading(true)
    setError('')
    // Small delay for UX
    await new Promise(r => setTimeout(r, 400))
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      setPage(result.role === 'admin' ? 'admin' : 'dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card fade-in">
        {/* Header decorative */}
        <div className="login-header">
          <div className="login-icon-wrap">
            <Lock size={26} />
          </div>
          <h1 className="login-title">Acceso Privado</h1>
          <p className="login-subtitle">
            Ingresa las credenciales asignadas a tu grupo para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Correo del grupo</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                className="form-input with-icon"
                placeholder="grupox@poster.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="form-input with-icon with-suffix"
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <p className="login-note">
          ⚠️ El registro libre no está habilitado. Solo pueden ingresar los grupos autorizados por el administrador.
        </p>
      </div>
    </div>
  )
}
