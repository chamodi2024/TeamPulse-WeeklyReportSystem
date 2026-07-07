import axiosInstance from './axiosInstance'

const readProjects = () => {
  const stored = localStorage.getItem('weekly-report-projects')
  return stored ? JSON.parse(stored) : []
}

const writeProjects = (projects) => {
  localStorage.setItem('weekly-report-projects', JSON.stringify(projects))
}

export const getAllProjects = async () => {
  try {
    return await axiosInstance.get('/projects')
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readProjects() }
  }
}

export const createProject = async (data) => {
  try {
    return await axiosInstance.post('/projects', data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const projects = [{ id: Date.now(), ...data }, ...readProjects()]
    writeProjects(projects)
    return { data: projects[0] }
  }
}

export const updateProject = async (id, data) => {
  try {
    return await axiosInstance.put(`/projects/${id}`, data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const projects = readProjects().map((item) => (item.id === id ? { ...item, ...data } : item))
    writeProjects(projects)
    return { data: projects.find((item) => item.id === id) }
  }
}

export const deleteProject = async (id) => {
  try {
    return await axiosInstance.delete(`/projects/${id}`)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const projects = readProjects().filter((item) => item.id !== id)
    writeProjects(projects)
    return { data: { success: true } }
  }
}
