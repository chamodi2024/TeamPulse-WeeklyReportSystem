import axiosInstance from './axiosInstance'
import { initialUsers } from './mockApi'

const persistSession = (payload) => {
  localStorage.setItem('accessToken', payload.accessToken)
  localStorage.setItem('refreshToken', payload.refreshToken)
  localStorage.setItem('user', JSON.stringify(payload.user))
}

const buildFallbackUser = (data, role = 'MEMBER') => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: {
    userId: Date.now(),
    name: data.name || data.email,
    email: data.email,
    role,
  },
})

export const registerUser = async (data) => {
  try {
    return await axiosInstance.post('/auth/register', data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const fallback = buildFallbackUser(data, data.role?.toUpperCase() || 'MEMBER')
    persistSession(fallback)
    return { data: fallback }
  }
}

export const loginUser = async (data) => {
  try {
    return await axiosInstance.post('/auth/login', data)
  } catch (error) {
    if (error.response) {
      throw error
    }

    const match = initialUsers.find((user) => user.email === data.email && user.password === data.password)

    if (!match) {
      throw new Error('Invalid credentials')
    }

    const fallback = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        userId: match.id,
        name: match.name,
        email: match.email,
        role: match.role.toUpperCase(),
      },
    }

    persistSession(fallback)
    return { data: fallback }
  }
}

export const logoutUser = async (refreshToken) => {
  try {
    return await axiosInstance.post('/auth/logout', { refreshToken })
  } catch (error) {
    if (error.response) {
      throw error
    }

    return { data: { success: true } }
  }
}
