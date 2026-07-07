import axiosInstance from './axiosInstance'

const readReports = () => {
  const stored = localStorage.getItem('weekly-report-reports')
  return stored ? JSON.parse(stored) : []
}

export const getSummary = async (weekStart, weekEnd) => {
  try {
    return await axiosInstance.get('/dashboard/summary', { params: { weekStart, weekEnd } })
  } catch (error) {
    if (error.response) {
      throw error
    }

    const reports = readReports()
    return {
      data: {
        totalSubmitted: reports.filter((item) => item.status === 'submitted').length,
        pending: reports.filter((item) => item.status === 'pending').length,
        blockers: reports.filter((item) => item.blockers && item.blockers !== 'None').length,
      },
    }
  }
}

export const getSubmissionStatus = async (weekStart, weekEnd) => {
  try {
    return await axiosInstance.get('/dashboard/submission-status', { params: { weekStart, weekEnd } })
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports() }
  }
}

export const getTaskTrend = async () => {
  try {
    return await axiosInstance.get('/dashboard/task-trend')
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports() }
  }
}

export const getWorkloadDistribution = async () => {
  try {
    return await axiosInstance.get('/dashboard/workload-distribution')
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports() }
  }
}

export const getRecentActivity = async () => {
  try {
    return await axiosInstance.get('/dashboard/recent-activity')
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: readReports().slice(0, 5) }
  }
}
