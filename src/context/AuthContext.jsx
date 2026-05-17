import React, { createContext, useContext, useState, useEffect } from 'react'

// =====================================================
// CREDENCIALES PREDEFINIDAS — Modifica aquí si necesitas
// =====================================================
export const GROUPS = [
  { id: 'grupo1', email: 'grupo1@poster.edu', password: 'G1Poster2026*', name: 'Grupo 1', members: 3 },
  { id: 'grupo2', email: 'grupo2@poster.edu', password: 'G2Poster2026*', name: 'Grupo 2', members: 3 },
  { id: 'grupo3', email: 'grupo3@poster.edu', password: 'G3Poster2026*', name: 'Grupo 3', members: 3 },
  { id: 'grupo4', email: 'grupo4@poster.edu', password: 'G4Poster2026*', name: 'Grupo 4', members: 3 },
  { id: 'grupo5', email: 'grupo5@poster.edu', password: 'G5Poster2026*', name: 'Grupo 5', members: 4 },
]

// Admin credentials
export const ADMIN = { email: 'admin@poster.edu', password: 'Admin2026*#' }

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('poster_session')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (email, password) => {
    const trimEmail = email.trim().toLowerCase()
    const trimPass  = password.trim()

    // Check admin
    if (trimEmail === ADMIN.email && trimPass === ADMIN.password) {
      const user = { role: 'admin', email: trimEmail, name: 'Administrador', id: 'admin' }
      setCurrentUser(user)
      localStorage.setItem('poster_session', JSON.stringify(user))
      return { success: true, role: 'admin' }
    }

    // Check groups
    const group = GROUPS.find(g => g.email === trimEmail && g.password === trimPass)
    if (group) {
      const user = { role: 'group', email: trimEmail, name: group.name, id: group.id, members: group.members }
      setCurrentUser(user)
      localStorage.setItem('poster_session', JSON.stringify(user))
      return { success: true, role: 'group' }
    }

    return { success: false, error: 'Correo o contraseña incorrectos.' }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('poster_session')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// =====================================================
// DATA LAYER — localStorage persistence
// =====================================================
const STORAGE_KEY = 'poster_projects'

export function getProjects() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export function saveProject(project) {
  const projects = getProjects()
  const idx = projects.findIndex(p => p.groupId === project.groupId)
  const timestamp = new Date().toISOString()
  if (idx >= 0) {
    projects[idx] = { ...projects[idx], ...project, updatedAt: timestamp }
  } else {
    projects.push({ ...project, createdAt: timestamp, updatedAt: timestamp, visits: 0 })
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  return projects[idx >= 0 ? idx : projects.length - 1]
}

export function getProjectByGroup(groupId) {
  return getProjects().find(p => p.groupId === groupId) || null
}

export function deleteProject(groupId) {
  const projects = getProjects().filter(p => p.groupId !== groupId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export function incrementVisit(groupId) {
  const projects = getProjects()
  const idx = projects.findIndex(p => p.groupId === groupId)
  if (idx >= 0) {
    projects[idx].visits = (projects[idx].visits || 0) + 1
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }
}
