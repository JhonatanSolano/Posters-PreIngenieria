import React, { useState, useEffect } from 'react'
import { getProjects, incrementVisit } from '../context/AuthContext'
import { Search, Download, Eye, FileText, BookOpen, Users, Target, BarChart3, X, Filter } from 'lucide-react'
import './PublicGallery.css'

const GROUP_COLORS = ['navy', 'gold', 'sage', 'rust', 'purple']

export default function PublicGallery({ setPage }) {
  const [projects, setProjects] = useState([])
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setProjects(getProjects().filter(p => p.published))
  }, [])

  const filtered = projects.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.groupName.toLowerCase().includes(q) ||
      p.objective.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || p.groupId === filter
    return matchSearch && matchFilter
  })

  const openProject = (p) => {
    incrementVisit(p.groupId)
    setSelected(p)
  }

  return (
    <div className="gallery-bg">
      {/* Hero */}
      <section className="gallery-hero">
        <div className="container hero-inner">
          <div className="hero-badge">Ciclo de profundización: PreIngeniería 2026</div>
          <h1 className="hero-title">Proyectos Estudiantiles</h1>
          <p className="hero-sub">
            Bienvenido a la exposición académica de pósters del Ciclo de Profundización: PreIngeniería 2026. 
            En este espacio encontrarás los proyectos de aplicación del cálculo diferencial, integral y álgebra lineal 
            desarrollados por cada grupo: problema abordado, objetivos, metodología y resultados obtenidos. 
            Explora y descarga los trabajos presentados.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">{projects.length}</span>
              <span className="stat-label">proyectos publicados</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">5</span>
              <span className="stat-label">grupos participantes</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-num">{projects.reduce((a, p) => a + (p.visits || 0), 0)}</span>
              <span className="stat-label">visitas totales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Controls */}
      <div className="container">
        <div className="gallery-controls">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Buscar por título, grupo u objetivo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}><X size={14} /></button>
            )}
          </div>

          <div className="filter-wrap">
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-input filter-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">Todos los grupos</option>
              <option value="grupo1">Grupo 1</option>
              <option value="grupo2">Grupo 2</option>
              <option value="grupo3">Grupo 3</option>
              <option value="grupo4">Grupo 4</option>
              <option value="grupo5">Grupo 5</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            {projects.length === 0 ? (
              <>
                <BookOpen size={48} opacity={0.3} />
                <h2>Aún no hay proyectos publicados</h2>
                <p>Los grupos deben iniciar sesión y subir su póster para que aparezca aquí.</p>
                <button className="btn btn-primary" onClick={() => setPage('login')}>
                  Ingresar como grupo
                </button>
              </>
            ) : (
              <>
                <Search size={40} opacity={0.3} />
                <h2>Sin resultados</h2>
                <p>Prueba con otros términos de búsqueda.</p>
                <button className="btn btn-ghost" onClick={() => { setSearch(''); setFilter('all') }}>
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map((p, i) => (
              <ProjectCard
                key={p.groupId}
                project={p}
                colorIdx={i % GROUP_COLORS.length}
                onClick={() => openProject(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function ProjectCard({ project, colorIdx, onClick }) {
  const color = GROUP_COLORS[colorIdx]
  const hasPosterImg = project.poster && project.posterType?.startsWith('image/')
  const hasPdf       = project.posterType === 'application/pdf'

  return (
    <div className={`project-card fade-in color-${color}`} onClick={onClick}>
      {/* Poster area */}
      <div className="card-media">
        {hasPosterImg ? (
          <img src={project.poster} alt={project.title} className="card-poster-img" />
        ) : hasPdf ? (
          <div className="card-pdf-placeholder">
            <FileText size={36} />
            <span>Ver PDF</span>
          </div>
        ) : (
          <div className="card-no-poster">
            <BookOpen size={36} />
          </div>
        )}
        <div className="card-overlay">
          <button className="card-view-btn"><Eye size={16} /> Ver proyecto</button>
        </div>
      </div>

      {/* Content */}
      <div className="card-content">
        <div className="card-top">
          <span className={`badge-group color-${color}`}>{project.groupName}</span>
          {project.visits > 0 && (
            <span className="card-visits">{project.visits} vistas</span>
          )}
        </div>
        <h3 className="card-title">{project.title}</h3>

        <div className="card-detail">
          <Target size={13} />
          <p className="card-text">{project.objective}</p>
        </div>
        <div className="card-detail">
          <BarChart3 size={13} />
          <p className="card-text">{project.results}</p>
        </div>
      </div>
    </div>
  )
}

function ProjectModal({ project, onClose }) {
  const hasPosterImg = project.poster && project.posterType?.startsWith('image/')
  const hasPdf       = project.posterType === 'application/pdf'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-group-tag">{project.groupName}</span>
            <h2 className="modal-title">{project.title}</h2>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          {hasPosterImg && (
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <img src={project.poster} alt={project.title} className="modal-poster-img" style={{ marginBottom: 0 }} />
              
                href={project.poster}
                download={project.posterName || 'poster.jpg'}
                className="btn btn-outline"
                style={{ marginTop: 10, display: 'inline-flex' }}
              <a>
                <Download size={15} /> Descargar imagen
              </a>
            </div>
          )}
          {hasPdf && (
            <div className="modal-pdf-box">
              <FileText size={44} color="var(--rust)" />
              <p>{project.posterName}</p>
              <a href={project.poster} download={project.posterName} className="btn btn-outline">
                <Download size={15} /> Descargar PDF
              </a>
            </div>
          )}
          <div className="modal-section">
            <div className="modal-section-label"><Target size={14} /> Objetivo General</div>
            <p>{project.objective}</p>
          </div>
          <div className="modal-section">
            <div className="modal-section-label"><BarChart3 size={14} /> Resultados</div>
            <p>{project.results}</p>
          </div>
          <div className="modal-meta">
            <Users size={13} /> {project.groupName}
            {project.visits > 0 && <span>· {project.visits} vistas</span>}
            {project.updatedAt && (
              <span>· Actualizado {new Date(project.updatedAt).toLocaleDateString('es-CO')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
