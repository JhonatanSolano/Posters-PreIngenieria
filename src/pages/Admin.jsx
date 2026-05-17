import React, { useState, useEffect } from 'react'
import { GROUPS, ADMIN, getProjects, deleteProject } from '../context/AuthContext'
import { ShieldCheck, Trash2, Eye, Users, BarChart3, BookOpen, AlertCircle, CheckCircle } from 'lucide-react'
import './Admin.css'

export default function Admin() {
  const [projects, setProjects]   = useState([])
  const [message,  setMessage]    = useState(null)
  const [tab, setTab]             = useState('projects')

  const reload = () => setProjects(getProjects())
  useEffect(() => { reload() }, [])

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleDelete = (groupId) => {
    if (!confirm(`¿Eliminar el proyecto del ${GROUPS.find(g=>g.id===groupId)?.name}?`)) return
    deleteProject(groupId)
    reload()
    showMsg('success', 'Proyecto eliminado.')
  }

  const published = projects.filter(p => p.published)
  const totalVisits = projects.reduce((a, p) => a + (p.visits || 0), 0)

  return (
    <div className="admin-bg">
      <div className="container admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-icon"><ShieldCheck size={22} /></div>
          <div>
            <h1 className="admin-title">Panel de Administración</h1>
            <p className="admin-sub">Gestión de los Pósters PreIngeniería 2026</p>
          </div>
        </div>

        {message && (
          <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'} admin-alert`}>
            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {message.text}
          </div>
        )}

        {/* Stats */}
        <div className="admin-stats">
          <StatCard icon={<BookOpen size={20} />} num={published.length} label="Proyectos publicados" color="navy" />
          <StatCard icon={<Users size={20} />}    num={GROUPS.length}    label="Grupos totales"       color="gold" />
          <StatCard icon={<BarChart3 size={20} />} num={totalVisits}     label="Visitas totales"      color="sage" />
          <StatCard icon={<Eye size={20} />}       num={GROUPS.length - published.length} label="Grupos sin publicar" color="rust" />
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${tab==='projects'?'active':''}`} onClick={()=>setTab('projects')}>
            Proyectos publicados
          </button>
          <button className={`admin-tab ${tab==='groups'?'active':''}`} onClick={()=>setTab('groups')}>
            Credenciales de grupos
          </button>
        </div>

        {/* PROJECTS TAB */}
        {tab === 'projects' && (
          <div className="admin-section">
            {published.length === 0 ? (
              <div className="admin-empty">
                <BookOpen size={40} opacity={0.3} />
                <p>Ningún grupo ha publicado su proyecto aún.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Grupo</th>
                      <th>Título</th>
                      <th>Archivo</th>
                      <th>Visitas</th>
                      <th>Publicado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {published.map(p => (
                      <tr key={p.groupId}>
                        <td><span className="badge badge-navy">{p.groupName}</span></td>
                        <td className="td-title">{p.title}</td>
                        <td>
                          <span className="file-type">
                            {p.posterType?.startsWith('image/') ? '🖼 Imagen' : '📄 PDF'}
                          </span>
                        </td>
                        <td>{p.visits || 0}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString('es-CO')}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(p.groupId)}
                          >
                            <Trash2 size={13} /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* GROUPS TAB */}
        {tab === 'groups' && (
          <div className="admin-section">
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>Para modificar las credenciales, edita el archivo <code>src/context/AuthContext.jsx</code> en la constante <code>GROUPS</code> o <code>ADMIN</code>.</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Grupo</th>
                    <th>Correo</th>
                    <th>Contraseña</th>
                    <th>Integrantes</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {GROUPS.map(g => {
                    const hasProject = published.some(p => p.groupId === g.id)
                    return (
                      <tr key={g.id}>
                        <td><span className="badge badge-navy">{g.name}</span></td>
                        <td><code className="code-cell">{g.email}</code></td>
                        <td><code className="code-cell">{g.password}</code></td>
                        <td>{g.members}</td>
                        <td>
                          {hasProject
                            ? <span className="status-dot published">● Publicado</span>
                            : <span className="status-dot pending">● Pendiente</span>
                          }
                        </td>
                      </tr>
                    )
                  })}
                  {/* Admin row */}
                  <tr className="admin-row">
                    <td><span className="badge badge-gold">Admin</span></td>
                    <td><code className="code-cell">{ADMIN.email}</code></td>
                    <td><code className="code-cell">{ADMIN.password}</code></td>
                    <td>—</td>
                    <td><span className="status-dot admin-st">● Admin</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, num, label, color }) {
  return (
    <div className={`stat-card color-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
