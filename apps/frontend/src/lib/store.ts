import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import type { User, Project, Notification, UIState, AuthState } from '@/types'
import { setAuthToken } from './api'

// ============================================================
// Auth Store
// ============================================================

interface AuthStore extends AuthState {
  login: (user: User, token: string, refreshToken: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,

        login: (user, token, refreshToken) => {
          setAuthToken(token)
          localStorage.setItem('accessToken', token)
          localStorage.setItem('refreshToken', refreshToken)
          set({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        },

        logout: () => {
          setAuthToken(null)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
          })
        },

        updateUser: (updates) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
          })),

        setLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: 'AuthStore' },
  ),
)

// ============================================================
// Project Store
// ============================================================

interface ProjectStore {
  projects: Project[]
  activeProject: Project | null
  isLoading: boolean
  error: string | null

  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  setActiveProject: (project: Project | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    persist(
      (set) => ({
        projects: [],
        activeProject: null,
        isLoading: false,
        error: null,

        setProjects: (projects) => set({ projects }),

        addProject: (project) =>
          set((state) => ({ projects: [project, ...state.projects] })),

        updateProject: (id, updates) =>
          set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
            activeProject:
              state.activeProject?.id === id
                ? { ...state.activeProject, ...updates }
                : state.activeProject,
          })),

        deleteProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            activeProject: state.activeProject?.id === id ? null : state.activeProject,
          })),

        setActiveProject: (project) => set({ activeProject: project }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
      }),
      {
        name: 'project-storage',
        partialize: (state) => ({
          activeProject: state.activeProject,
        }),
      },
    ),
    { name: 'ProjectStore' },
  ),
)

// ============================================================
// UI Store
// ============================================================

interface UIStore extends UIState {
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setGlobalSearch: (search: string) => void
  setTheme: (theme: UIState['theme']) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        sidebarCollapsed: false,
        activeProject: null,
        notifications: [],
        unreadNotifications: 0,
        globalSearch: '',
        theme: 'light',

        setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

        setGlobalSearch: (search) => set({ globalSearch: search }),

        setTheme: (theme) => set({ theme }),

        addNotification: (notification) =>
          set((state) => {
            const newNotification: Notification = {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
            }
            return {
              notifications: [newNotification, ...state.notifications].slice(0, 50),
              unreadNotifications: state.unreadNotifications + 1,
            }
          }),

        markNotificationRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n,
            ),
            unreadNotifications: Math.max(0, state.unreadNotifications - 1),
          })),

        markAllNotificationsRead: () =>
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadNotifications: 0,
          })),

        clearNotifications: () => set({ notifications: [], unreadNotifications: 0 }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      },
    ),
    { name: 'UIStore' },
  ),
)

// ============================================================
// Test Execution Store
// ============================================================

interface TestExecutionStore {
  currentRunId: string | null
  currentCaseIndex: number
  isExecuting: boolean
  results: Record<string, { status: string; notes: string; evidence: string[] }>

  setCurrentRun: (runId: string | null) => void
  setCurrentCaseIndex: (index: number) => void
  setExecuting: (executing: boolean) => void
  saveResult: (caseId: string, status: string, notes: string) => void
  clearResults: () => void
}

export const useTestExecutionStore = create<TestExecutionStore>()(
  devtools(
    (set) => ({
      currentRunId: null,
      currentCaseIndex: 0,
      isExecuting: false,
      results: {},

      setCurrentRun: (runId) => set({ currentRunId: runId, currentCaseIndex: 0, results: {} }),
      setCurrentCaseIndex: (index) => set({ currentCaseIndex: index }),
      setExecuting: (executing) => set({ isExecuting: executing }),
      saveResult: (caseId, status, notes) =>
        set((state) => ({
          results: {
            ...state.results,
            [caseId]: { status, notes, evidence: state.results[caseId]?.evidence || [] },
          },
        })),
      clearResults: () => set({ results: {}, currentRunId: null, currentCaseIndex: 0 }),
    }),
    { name: 'TestExecutionStore' },
  ),
)

// ============================================================
// AI Store
// ============================================================

interface AIStore {
  conversations: Array<{ id: string; title: string; updatedAt: string }>
  activeConversationId: string | null
  isStreaming: boolean
  suggestedPrompts: string[]

  setConversations: (convs: AIStore['conversations']) => void
  setActiveConversation: (id: string | null) => void
  setStreaming: (streaming: boolean) => void
  addConversation: (conv: { id: string; title: string; updatedAt: string }) => void
}

export const useAIStore = create<AIStore>()(
  devtools(
    (set) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      suggestedPrompts: [
        'Generate test cases for the login feature',
        'Analyze gaps in the current requirements',
        'Create a test strategy for the payment module',
        'Summarize open critical defects',
        'Generate a release readiness report',
        'What test cases are missing coverage?',
      ],

      setConversations: (convs) => set({ conversations: convs }),
      setActiveConversation: (id) => set({ activeConversationId: id }),
      setStreaming: (streaming) => set({ isStreaming: streaming }),
      addConversation: (conv) =>
        set((state) => ({
          conversations: [conv, ...state.conversations],
          activeConversationId: conv.id,
        })),
    }),
    { name: 'AIStore' },
  ),
)
