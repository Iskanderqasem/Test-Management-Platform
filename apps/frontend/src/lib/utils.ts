import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import type { DefectSeverity, ExecutionResult, Priority, ProjectStatus, EnvironmentStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================
// Date Utilities
// ============================================================

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return 'Invalid date'
    return format(d, pattern)
  } catch {
    return 'Invalid date'
  }
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM d, yyyy HH:mm')
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return 'Unknown'
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return 'Unknown'
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

// ============================================================
// Color & Status Utilities
// ============================================================

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    critical: 'text-red-600 bg-red-50 border-red-200',
    high: 'text-orange-600 bg-orange-50 border-orange-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200',
  }
  return colors[priority] || 'text-gray-600 bg-gray-50 border-gray-200'
}

export function getPriorityDot(priority: Priority): string {
  const colors: Record<Priority, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  }
  return colors[priority] || 'bg-gray-500'
}

export function getSeverityColor(severity: DefectSeverity): string {
  const colors: Record<DefectSeverity, string> = {
    critical: 'text-red-700 bg-red-50 border-red-300',
    major: 'text-orange-700 bg-orange-50 border-orange-300',
    moderate: 'text-yellow-700 bg-yellow-50 border-yellow-300',
    minor: 'text-blue-700 bg-blue-50 border-blue-300',
    trivial: 'text-gray-600 bg-gray-50 border-gray-300',
  }
  return colors[severity] || 'text-gray-600 bg-gray-50 border-gray-200'
}

export function getExecutionResultColor(result: ExecutionResult): string {
  const colors: Record<ExecutionResult, string> = {
    pass: 'text-green-700 bg-green-50 border-green-200',
    fail: 'text-red-700 bg-red-50 border-red-200',
    blocked: 'text-orange-700 bg-orange-50 border-orange-200',
    skip: 'text-gray-600 bg-gray-50 border-gray-200',
    not_executed: 'text-blue-600 bg-blue-50 border-blue-200',
  }
  return colors[result] || 'text-gray-600 bg-gray-50 border-gray-200'
}

export function getProjectStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    planning: 'text-blue-700 bg-blue-50 border-blue-200',
    active: 'text-green-700 bg-green-50 border-green-200',
    on_hold: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    completed: 'text-purple-700 bg-purple-50 border-purple-200',
    cancelled: 'text-gray-600 bg-gray-50 border-gray-200',
  }
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200'
}

export function getEnvironmentStatusColor(status: EnvironmentStatus): string {
  const colors: Record<EnvironmentStatus, string> = {
    healthy: 'text-green-700 bg-green-50',
    degraded: 'text-yellow-700 bg-yellow-50',
    down: 'text-red-700 bg-red-50',
    maintenance: 'text-blue-700 bg-blue-50',
    unknown: 'text-gray-600 bg-gray-50',
  }
  return colors[status] || 'text-gray-600 bg-gray-50'
}

export function getEnvironmentStatusDot(status: EnvironmentStatus): string {
  const colors: Record<EnvironmentStatus, string> = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
    maintenance: 'bg-blue-500',
    unknown: 'bg-gray-400',
  }
  return colors[status] || 'bg-gray-400'
}

// ============================================================
// Number Formatting
// ============================================================

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

// ============================================================
// String Utilities
// ============================================================

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...`
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function titleCase(str: string): string {
  return str
    .split(/[_\s-]+/)
    .map(capitalize)
    .join(' ')
}

export function generateCode(prefix: string, id: string | number): string {
  const num = typeof id === 'number' ? id : parseInt(id, 36) % 10000
  return `${prefix}-${String(num).padStart(4, '0')}`
}

// ============================================================
// Array & Object Utilities
// ============================================================

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (groups, item) => {
      const groupKey = String(item[key])
      return {
        ...groups,
        [groupKey]: [...(groups[groupKey] || []), item],
      }
    },
    {} as Record<string, T[]>,
  )
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// ============================================================
// Validation Helpers
// ============================================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// ============================================================
// Debounce / Throttle
// ============================================================

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// ============================================================
// Mock Data Helpers
// ============================================================

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}
