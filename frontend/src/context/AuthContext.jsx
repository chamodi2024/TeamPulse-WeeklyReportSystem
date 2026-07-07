import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialProjects, initialReports, initialUsers } from '../api/mockApi'

const AuthContext = createContext(null)

const storageKeys = {
  users: 'weekly-report-users',
  projects: 'weekly-report-projects',
  reports: 'weekly-report-reports',
  currentUser: 'weekly-report-current-user',
  user: 'user',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}

function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readStorage(storageKeys.users, initialUsers))
  const [projects, setProjects] = useState(() => readStorage(storageKeys.projects, initialProjects))
  const [reports, setReports] = useState(() => readStorage(storageKeys.reports, initialReports))
  const [currentUser, setCurrentUser] = useState(() => readStorage(storageKeys.currentUser, null))
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem(storageKeys.user)
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    writeStorage(storageKeys.users, users)
  }, [users])

  useEffect(() => {
    writeStorage(storageKeys.projects, projects)
  }, [projects])

  useEffect(() => {
    writeStorage(storageKeys.reports, reports)
  }, [reports])

  useEffect(() => {
    writeStorage(storageKeys.currentUser, currentUser)
  }, [currentUser])

  useEffect(() => {
    setLoading(false)
  }, [])

  const login = (authResponse) => {
    const { accessToken, refreshToken, user: authUser } = authResponse

    if (!accessToken || !refreshToken || !authUser) {
      return false
    }

    window.localStorage.setItem(storageKeys.accessToken, accessToken)
    window.localStorage.setItem(storageKeys.refreshToken, refreshToken)
    window.localStorage.setItem(storageKeys.user, JSON.stringify(authUser))
    setUser(authUser)
    setCurrentUser({ id: authUser.userId, name: authUser.name, email: authUser.email, role: authUser.role.toLowerCase() })
    return true
  }

  const register = (userInput) => {
    const exists = users.some((user) => user.email === userInput.email)

    if (exists) {
      return false
    }

    const newUser = {
      id: Date.now(),
      ...userInput,
    }

    setUsers((prev) => [newUser, ...prev])
    setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role })
    return true
  }

  const logout = () => {
    window.localStorage.removeItem(storageKeys.user)
    window.localStorage.removeItem(storageKeys.accessToken)
    window.localStorage.removeItem(storageKeys.refreshToken)
    setUser(null)
    setCurrentUser(null)
  }

  const addReport = (report) => {
    setReports((prev) => [
      {
        id: Date.now(),
        ...report,
      },
      ...prev,
    ])
  }

  const updateReport = (id, payload) => {
    setReports((prev) => prev.map((report) => (report.id === id ? { ...report, ...payload } : report)))
  }

  const addProject = (projectInput) => {
    const newProject = { id: Date.now(), ...projectInput }
    setProjects((prev) => [newProject, ...prev])
    return newProject
  }

  const updateProject = (id, payload) => {
    setProjects((prev) => prev.map((project) => (project.id === id ? { ...project, ...payload } : project)))
  }

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((project) => project.id !== id))
  }

  const value = useMemo(
    () => ({
      users,
      projects,
      reports,
      currentUser,
      user,
      loading,
      login,
      register,
      logout,
      addReport,
      updateReport,
      addProject,
      updateProject,
      deleteProject,
    }),
    [users, projects, reports, currentUser, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
