import axiosInstance from './axiosInstance'

const readReports = () => {
  const stored = localStorage.getItem('weekly-report-reports')
  return stored ? JSON.parse(stored) : []
}

const writeReports = (reports) => {
  localStorage.setItem('weekly-report-reports', JSON.stringify(reports))
}

export const createReport = async (data) => {
  try {
    return await axiosInstance.post('/reports', data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const reports = readReports()
    const next = [{ id: Date.now(), ...data }, ...reports]
    writeReports(next)
    return { data: next[0] }
  }
}

export const createAndSubmitReport = async (data) => {
  try {
    return await axiosInstance.post('/reports/submit', data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    return createReport({ ...data, status: 'submitted' })
  }
}

export const updateReport = async (id, data) => {
  try {
    return await axiosInstance.put(`/reports/${id}`, data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const reports = readReports().map((item) => (item.id === id ? { ...item, ...data } : item))
    writeReports(reports)
    return { data: reports.find((item) => item.id === id) }
  }
}

export const submitReport = async (id) => {
  try {
    return await axiosInstance.patch(`/reports/${id}/submit`)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const reports = readReports().map((item) => (item.id === id ? { ...item, status: 'submitted' } : item))
    writeReports(reports)
    return { data: reports.find((item) => item.id === id) }
  }
}

export const getMyReports = async () => {
  try {
    return await axiosInstance.get('/reports/my')
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports() }
  }
}

export const getReportById = async (id) => {
  try {
    return await axiosInstance.get(`/reports/${id}`)
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports().find((item) => item.id === id) }
  }
}

export const getTeamReports = async (params) => {
  try {
    return await axiosInstance.get('/reports/team', { params })
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports() }
  }
}
