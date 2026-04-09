import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH API ====================
export const authAPI = {
  register: async (name, email, password, rollNumber, role) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        rollNumber,
        role
      })
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  logout: async () => {
    localStorage.removeItem('token')
    return { success: true }
  }
}

// ==================== MENU API ====================
export const menuAPI = {
  getDailyMenu: async () => {
    try {
      const response = await api.get('/menu/today')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getWeeklyMenu: async () => {
    try {
      const response = await api.get('/menu/weekly')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

// ==================== RATING API ====================
export const ratingAPI = {
  submitRating: async (mealId, mealName, rating, date) => {
    try {
      const response = await api.post('/rating/submit', {
        mealId,
        mealName,
        rating,
        date
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getAverageRatings: async () => {
    try {
      const response = await api.get('/rating/averages')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getUserRatings: async () => {
    try {
      const response = await api.get('/rating/my-ratings')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getUserRating: async (mealId) => {
    try {
      const response = await api.get(`/rating/user/${mealId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

// ==================== FEEDBACK API ====================
export const feedbackAPI = {
  submitFeedback: async (mealName, issueType, comment, isAnonymous, rating) => {
    try {
      const response = await api.post('/feedback/submit', {
        mealName,
        issueType,
        comment,
        isAnonymous,
        rating
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getAllFeedback: async () => {
    try {
      const response = await api.get('/feedback/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getFeedback: async () => {
    try {
      const response = await api.get('/feedback/all')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getTopFeedback: async (page = 1, limit = 6) => {
    try {
      const response = await api.get(`/feedback/top?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getUserFeedback: async () => {
    try {
      const response = await api.get('/feedback/user')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getFeedbackByMeal: async (mealName) => {
    try {
      const response = await api.get(`/feedback/meal/${mealName}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  getSummary: async () => {
    try {
      const response = await api.get('/feedback/summary')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  updateFeedbackStatus: async (feedbackId, status) => {
    try {
      const response = await api.patch(`/feedback/${feedbackId}/status`, { status })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

// ==================== ADMIN API ====================
export const analyticsAPI = {
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  generateReport: async () => {
    try {
      const response = await api.get('/admin/report')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default api
