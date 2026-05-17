import React, { useState, useEffect, useRef } from 'react'
import { useAuth, getProjectByGroup, saveProject, deleteProject } from '../context/AuthContext'
import { Upload, FileText, Image, Save, Eye, Trash2, CheckCircle, AlertCircle, Edit3, X } from 'lucide-react'
import './Dashboard.css'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload  = () => res(reader.result)
    reader.onerror = rej
    reader.readAsDataURL(file)
  })
}

export default function Dashboard({ setPage }) {
  const { currentUser } = useAuth()
  const [project, setProject]   = useState(null)
  const [editing, setEditing]   = useState(false)
  const [preview, setPreview]   = useState(false)
  const [saving,  setSaving]    = useState(false)
  const [message, setMessage]   = useState(null)
  const [form, setForm]         = useState({ title: '', objective: '', results: '' })
  const [posterFile, setPosterFile]   = useState(null)  // { name, type, data }
  const [posterPreview, setPosterPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    const p = getProjectByGroup(currentUser.id)
    if (p) {
      setProject(p)
      setForm({ title: p.title, objective: p.objective, results: p.results })
      if (p.poster) setPosterPreview(p.poster)
    } else {
      setEditing(true) // First time — open form immediately
    }
  }, [currentUser.id])

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (!allowed.includes(file.type)) {
      showMsg('error', 'Solo se permiten archivos JPG, PNG o PDF.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      showMsg('error', 'El archivo no debe superar los 10 MB.')
      return
    }
    const base64 = await fileToBase64(file)
    setPosterFile({ name: file.name, type: file.type, data: base64 })
    if (file.type.startsWith('image/')) setPosterPreview(base64)
    else setPosterPreview(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim())     { showMsg('error', 'El título es obligatorio.'); return }
    if (!form.objective.trim()) { showMsg('error', 'El objetivo general es obligatorio.'); return }
    if (!form.results.trim())   { showMsg('error', 'Los resultados son obligatorios.'); return }
    if (!project && !posterFile){ showMsg('error', 'Debes subir el póster de tu proyecto.'); return }

    setSaving(true)
    await new Promise(r => setTimeout(r, 500))

    const projectData = {
      groupId:   currentUser.id,
      groupName: currentUser.name,
      title:     form.title.trim(),
      objective: form.objective.trim(),
      results:   form.results.trim(),
      poster:    posterFile ? posterFile.data : (project?.poster || null),
      posterName: posterFile ? posterFile.name : (project?.posterName || null),
      posterType: posterFile ? posterFile.type : (project?.posterType || null),
      published:  true,
    }

    saveProject(projectData)
    const updated = getProjectByGroup(currentUser.id)
    setProject(updated)
    if (posterFile) setPosterPreview(posterFile.type.startsWith('image/') ? posterFile.data : null)
    setEditing(false)
    setSaving(false)
    showMsg('success', '¡Proyecto guardado y publicado exitosamente!')
  }

  const handleDelete = () => {
    if (!confirm('¿Estás seguro de eliminar tu proyecto? Esta acción no se puede deshacer.')) return
    deleteProject(currentUser.id)
    setProject(null)
    setForm({ title: '', objective: '', results: '' })
    setPosterFile(null)
    setPosterPreview(null)
    setEditing(true)
    showMsg('success', 'Proyecto eliminado.')
  }

  const startEdit = () => {
    setForm({ title: project.title, objective: project.objective, results: project.results })
    setEditing(true)
    setPreview(false)
  }

  return (
    <div className="dashboard-bg">
      <div className="container dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Panel del {currentUser.name}</h1>
            <p className="dashboard-sub">{currentUser.members} integrantes · {currentUser.email}</p>
          </div>
          <div className="dash-status">
            {project
              ? <span className="status-badge published">● Publicado</span>
              : <span className="status-badge draft">● Sin publicar</span>
            }
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`alert alert-${message.type === 'error' ? 'error' : 'success'} dash-alert`}>
            {message.type === 'error'
              ? <AlertCircle size={16} style={{ flexShrink: 0 }} />
              : <CheckCircle size={16} style={{ flexShrink: 0 }} />
            }
            {message.text}
          </div>
        )}

        <div className="dashboard-grid">
          {/* === FORM === */}
          <div className="dash-main">
            <div className="card dash-card">
              <div className="dash-card-header">
                <h2 className="dash-card-title">
                  <FileText size={18} /> Información del Proyecto
                </h2>
                {project && !editing && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={startEdit}>
                      <Edit3 size={14} /> Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                )}
                {editing && project && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                    <X size={14} /> Cancelar
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="dash-form">
                  {/* File upload */}
                  <div className="form-group">
                    <label className="form-label">Póster del Proyecto (JPG, PNG, PDF)</label>
                    <div
                      className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current.click()}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: 'none' }}
                        onChange={e => handleFile(e.target.files[0])}
                      />
                      {posterFile ? (
                        <div className="drop-success">
                          {posterFile.type.startsWith('image/')
                            ? <Image size={24} />
                            : <FileText size={24} />
                          }
                          <span>{posterFile.name}</span>
                          <small>Haz clic para cambiar</small>
                        </div>
                      ) : project?.posterName ? (
                        <div className="drop-success">
                          <CheckCircle size={24} color="var(--sage)" />
                          <span>{project.posterName}</span>
                          <small>Haz clic para reemplazar</small>
                        </div>
                      ) : (
                        <div className="drop-placeholder">
                          <Upload size={28} />
                          <span>Arrastra o haz clic para subir</span>
                          <small>JPG, PNG o PDF · Máx. 10 MB</small>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Título del Proyecto *</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Ej: Análisis de impacto ambiental en cuencas hídricas..."
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      maxLength={200}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Objetivo General *</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Describe el objetivo principal del proyecto..."
                      value={form.objective}
                      onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resultados *</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Describe los principales resultados obtenidos..."
                      value={form.results}
                      onChange={e => setForm(f => ({ ...f, results: e.target.value }))}
                      rows={5}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.4)', borderTopColor: '#fff' }} /> : <Save size={16} />}
                      {saving ? 'Guardando...' : project ? 'Guardar cambios' : 'Publicar proyecto'}
                    </button>
                    {project && (
                      <button type="button" className="btn btn-ghost" onClick={() => setPreview(true)}>
                        <Eye size={16} /> Vista previa
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                /* Read-only view */
                <div className="dash-view">
                  <h3 className="project-view-title">{project?.title}</h3>
                  <div className="view-section">
                    <span className="view-label">Objetivo General</span>
                    <p>{project?.objective}</p>
                  </div>
                  <div className="view-section">
                    <span className="view-label">Resultados</span>
                    <p>{project?.results}</p>
                  </div>
                  <div className="view-section">
                    <span className="view-label">Archivo subido</span>
                    <p>{project?.posterName}</p>
                  </div>
                  <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                    <button className="btn btn-outline" onClick={() => setPreview(true)}>
                      <Eye size={16} /> Ver vista pública
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="dash-sidebar">
            {/* Poster preview */}
            {(posterPreview || (project?.poster && project?.posterType?.startsWith('image/'))) && (
              <div className="card dash-card">
                <div className="dash-card-header">
                  <h3 className="dash-card-title"><Image size={16} /> Póster</h3>
                </div>
                <div className="poster-thumb-wrap">
                  <img
                    src={posterPreview || project?.poster}
                    alt="Póster del proyecto"
                    className="poster-thumb"
                  />
                </div>
              </div>
            )}

            {/* PDF indicator */}
            {(posterFile?.type === 'application/pdf' || (!posterFile && project?.posterType === 'application/pdf')) && (
              <div className="card dash-card pdf-card">
                <FileText size={32} color="var(--rust)" />
                <p>Póster PDF cargado</p>
                <small>{posterFile?.name || project?.posterName}</small>
              </div>
            )}

            {/* Tips */}
            <div className="card dash-card tips-card">
              <h3 className="dash-card-title">💡 Instrucciones</h3>
              <ul className="tips-list">
                <li>Cada grupo puede publicar <strong>un solo proyecto</strong>.</li>
                <li>Puedes editar la información antes y después de publicar.</li>
                <li>El proyecto aparecerá de inmediato en la sección pública.</li>
                <li>El archivo debe ser JPG, PNG o PDF (máx. 10 MB).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {preview && project && (
        <div className="modal-overlay" onClick={() => setPreview(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Vista pública — {project.groupName}</h2>
              <button className="modal-close" onClick={() => setPreview(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {project.poster && project.posterType?.startsWith('image/') && (
                <img src={project.poster} alt="Póster" className="modal-poster-img" />
              )}
              {project.posterType === 'application/pdf' && (
                <div className="modal-pdf-info">
                  <FileText size={40} color="var(--rust)" />
                  <p>{project.posterName}</p>
                  <a
                    href={project.poster}
                    download={project.posterName}
                    className="btn btn-outline"
                    style={{ marginTop: 10 }}
                  >
                    Descargar PDF
                  </a>
                </div>
              )}
              <h3 className="modal-project-title">{project.title}</h3>
              <div className="modal-section">
                <span className="view-label">Objetivo General</span>
                <p>{project.objective}</p>
              </div>
              <div className="modal-section">
                <span className="view-label">Resultados</span>
                <p>{project.results}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
