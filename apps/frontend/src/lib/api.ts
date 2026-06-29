import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiResponse, PaginatedResponse } from '@/types'

// ============================================================
// Axios Instance
// ============================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
})

// ============================================================
// Token Management
// ============================================================

let accessToken: string | null = null
let refreshPromise: Promise<string | null> | null = null

export function setAuthToken(token: string | null): void {
  accessToken = token
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

export function getAuthToken(): string | null {
  return accessToken
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return null

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
      refreshToken,
    })

    const newToken = response.data.data.accessToken
    setAuthToken(newToken)
    localStorage.setItem('accessToken', newToken)
    return newToken
  } catch {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
    return null
  }
}

// ============================================================
// Request Interceptor
// ============================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Inject auth token
    const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null)
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() }

    // Add CSRF token if available
    if (typeof document !== 'undefined') {
      const csrfToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))
        ?.split('=')[1]
      if (csrfToken && config.headers) {
        config.headers['X-CSRFToken'] = csrfToken
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ============================================================
// Response Interceptor
// ============================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const newToken = await refreshPromise
      if (newToken && originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return apiClient(originalRequest)
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data)
    }

    // Handle 500 Server Error
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data)
    }

    // Transform error to consistent format
    const apiError: ApiError = {
      message: extractErrorMessage(error),
      code: extractErrorCode(error),
      details: extractErrorDetails(error),
      statusCode: error.response?.status || 0,
    }

    return Promise.reject(apiError)
  },
)

function extractErrorMessage(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>
    if (typeof data.message === 'string') return data.message
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.error === 'string') return data.error
  }
  if (error.message === 'Network Error') return 'Unable to connect to the server. Please check your connection.'
  if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.'
  return error.message || 'An unexpected error occurred.'
}

function extractErrorCode(error: AxiosError): string {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>
    if (typeof data.code === 'string') return data.code
  }
  return error.code || 'UNKNOWN_ERROR'
}

function extractErrorDetails(error: AxiosError): Record<string, string[]> | undefined {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as Record<string, unknown>
    if (data.details && typeof data.details === 'object') {
      return data.details as Record<string, string[]>
    }
  }
  return undefined
}

// ============================================================
// API Methods
// ============================================================

export const api = {
  // Generic CRUD
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.get(url, config).then((r) => r.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.post(url, data, config).then((r) => r.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.put(url, data, config).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    apiClient.delete(url, config).then((r) => r.data),

  getPaginated: <T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> =>
    apiClient.get(url, config).then((r) => r.data),

  upload: <T>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> =>
    apiClient.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    }).then((r) => r.data),

  download: (url: string, filename?: string): Promise<void> =>
    apiClient.get(url, { responseType: 'blob' }).then((response) => {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename || 'download'
      link.click()
      window.URL.revokeObjectURL(link.href)
    }),
}

// ============================================================
// API Endpoints
// ============================================================

export const endpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    sso: '/api/auth/sso',
  },

  // Projects
  projects: {
    list: '/api/projects',
    create: '/api/projects',
    get: (id: string) => `/api/projects/${id}`,
    update: (id: string) => `/api/projects/${id}`,
    delete: (id: string) => `/api/projects/${id}`,
    members: (id: string) => `/api/projects/${id}/members`,
    stats: (id: string) => `/api/projects/${id}/stats`,
    releases: (id: string) => `/api/projects/${id}/releases`,
    sprints: (id: string) => `/api/projects/${id}/sprints`,
    environments: (id: string) => `/api/projects/${id}/environments`,
  },

  // Requirements
  requirements: {
    list: (projectId: string) => `/api/projects/${projectId}/requirements`,
    create: (projectId: string) => `/api/projects/${projectId}/requirements`,
    get: (projectId: string, id: string) => `/api/projects/${projectId}/requirements/${id}`,
    update: (projectId: string, id: string) => `/api/projects/${projectId}/requirements/${id}`,
    delete: (projectId: string, id: string) => `/api/projects/${projectId}/requirements/${id}`,
    upload: (projectId: string) => `/api/projects/${projectId}/requirements/upload`,
    analyze: (projectId: string) => `/api/projects/${projectId}/requirements/analyze`,
    gapAnalysis: (projectId: string) => `/api/projects/${projectId}/requirements/gap-analysis`,
    rtm: (projectId: string) => `/api/projects/${projectId}/requirements/rtm`,
  },

  // Test Cases
  testCases: {
    list: (projectId: string) => `/api/projects/${projectId}/test-cases`,
    create: (projectId: string) => `/api/projects/${projectId}/test-cases`,
    get: (projectId: string, id: string) => `/api/projects/${projectId}/test-cases/${id}`,
    update: (projectId: string, id: string) => `/api/projects/${projectId}/test-cases/${id}`,
    delete: (projectId: string, id: string) => `/api/projects/${projectId}/test-cases/${id}`,
    generate: (projectId: string) => `/api/projects/${projectId}/test-cases/generate`,
    bulkImport: (projectId: string) => `/api/projects/${projectId}/test-cases/bulk-import`,
  },

  // Test Plans
  testPlans: {
    list: (projectId: string) => `/api/projects/${projectId}/test-plans`,
    create: (projectId: string) => `/api/projects/${projectId}/test-plans`,
    get: (projectId: string, id: string) => `/api/projects/${projectId}/test-plans/${id}`,
    update: (projectId: string, id: string) => `/api/projects/${projectId}/test-plans/${id}`,
  },

  // Test Runs
  testRuns: {
    list: (projectId: string) => `/api/projects/${projectId}/test-runs`,
    create: (projectId: string) => `/api/projects/${projectId}/test-runs`,
    get: (projectId: string, id: string) => `/api/projects/${projectId}/test-runs/${id}`,
    update: (projectId: string, id: string) => `/api/projects/${projectId}/test-runs/${id}`,
    updateCase: (projectId: string, runId: string, caseId: string) =>
      `/api/projects/${projectId}/test-runs/${runId}/cases/${caseId}`,
    uploadEvidence: (projectId: string, runId: string, caseId: string) =>
      `/api/projects/${projectId}/test-runs/${runId}/cases/${caseId}/evidence`,
  },

  // Defects
  defects: {
    list: (projectId: string) => `/api/projects/${projectId}/defects`,
    create: (projectId: string) => `/api/projects/${projectId}/defects`,
    get: (projectId: string, id: string) => `/api/projects/${projectId}/defects/${id}`,
    update: (projectId: string, id: string) => `/api/projects/${projectId}/defects/${id}`,
    analyze: (projectId: string, id: string) => `/api/projects/${projectId}/defects/${id}/analyze`,
    exportToJira: (projectId: string, id: string) => `/api/projects/${projectId}/defects/${id}/export/jira`,
    exportToAdo: (projectId: string, id: string) => `/api/projects/${projectId}/defects/${id}/export/ado`,
  },

  // AI
  ai: {
    chat: '/api/ai/chat',
    generateTestStrategy: '/api/ai/generate/test-strategy',
    generateTestPlan: '/api/ai/generate/test-plan',
    generateTestCases: '/api/ai/generate/test-cases',
    analyzeDefect: '/api/ai/analyze/defect',
    analyzeRequirements: '/api/ai/analyze/requirements',
    conversations: '/api/ai/conversations',
  },

  // Reports
  reports: {
    list: (projectId: string) => `/api/projects/${projectId}/reports`,
    generate: (projectId: string) => `/api/projects/${projectId}/reports/generate`,
    download: (projectId: string, id: string) => `/api/projects/${projectId}/reports/${id}/download`,
    schedules: (projectId: string) => `/api/projects/${projectId}/reports/schedules`,
  },

  // Environments
  environments: {
    list: '/api/environments',
    get: (id: string) => `/api/environments/${id}`,
    check: (id: string) => `/api/environments/${id}/check`,
    checkAll: '/api/environments/check-all',
  },

  // Knowledge Base
  kb: {
    articles: '/api/kb/articles',
    search: '/api/kb/search',
    categories: '/api/kb/categories',
    ask: '/api/kb/ask',
  },

  // Dashboard
  dashboard: {
    metrics: '/api/dashboard/metrics',
    activity: '/api/dashboard/activity',
    health: '/api/dashboard/project-health',
    trends: '/api/dashboard/trends',
  },
}

export default apiClient
