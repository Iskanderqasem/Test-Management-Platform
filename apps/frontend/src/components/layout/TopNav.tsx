'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore, useUIStore } from '@/lib/store'
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  HelpCircle,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Keyboard,
  FolderOpen,
  Zap,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { cn, formatRelativeTime } from '@/lib/utils'

const mockNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Test Run Completed',
    message: 'Sprint 23 Test Run finished with 94% pass rate',
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'error' as const,
    title: 'Critical Defect Detected',
    message: 'DEF-0142: Payment gateway returns 500 on checkout',
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'info' as const,
    title: 'AI Analysis Complete',
    message: 'Gap analysis found 3 missing requirements in Module B',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'warning' as const,
    title: 'Environment Degraded',
    message: 'Staging API response time increased to 3.2s',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
]

function NotificationIcon({ type }: { type: 'success' | 'error' | 'info' | 'warning' }) {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />,
    warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  }
  return icons[type]
}

export default function TopNav() {
  const { user, logout } = useAuthStore()
  const { unreadNotifications, markAllNotificationsRead } = useUIStore()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-4 shrink-0 z-40">
      {/* Left: Search */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 w-full max-w-md h-9 px-3 rounded-md border border-gray-300 bg-gray-50 text-gray-400 text-sm hover:border-[#1e3a5f] hover:bg-white transition-colors"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-xs text-gray-500 font-mono">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Quick Actions */}
        <Link
          href="/projects/create"
          className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#f97316] text-white text-xs font-medium hover:bg-[#ea6c0d] transition-colors"
        >
          <Zap className="h-3.5 w-3.5" />
          Quick Create
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-4 w-4 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#1e3a5f] hover:underline"
                    >
                      Mark all read
                    </button>
                    <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer',
                        !notif.read && 'bg-blue-50/50',
                      )}
                    >
                      <div className="shrink-0 mt-0.5">
                        <NotificationIcon type={notif.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                      </div>
                      {!notif.read && <div className="shrink-0 mt-1.5 h-2 w-2 rounded-full bg-[#1e3a5f]" />}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <Link href="/notifications" className="text-xs text-[#1e3a5f] hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help */}
        <button className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
          <HelpCircle className="h-4 w-4 text-gray-600" />
        </button>

        {/* Separator */}
        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 capitalize">{user?.role?.replace('_', ' ') || 'Member'}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderOpen className="h-4 w-4" />
              My Projects
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard className="h-4 w-4" />
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-20">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search projects, test cases, defects, requirements..."
                className="flex-1 text-sm outline-none placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              {!searchQuery ? (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
                  <div className="space-y-1">
                    {[
                      { label: 'All Projects', href: '/projects', icon: <FolderOpen className="h-4 w-4" /> },
                      { label: 'AI Assistant', href: '/ai-assistant', icon: <Zap className="h-4 w-4" /> },
                      { label: 'Create Test Case', href: '/test-cases/generate', icon: <Search className="h-4 w-4" /> },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-400">{item.icon}</span>
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-4 text-center">
                  Searching for &quot;{searchQuery}&quot;...
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-400">
              <span>↵ to select</span>
              <span>↑↓ to navigate</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
