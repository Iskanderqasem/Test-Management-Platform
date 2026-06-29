'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/store'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  ClipboardList,
  TestTube,
  Play,
  Bug,
  Bot,
  BarChart3,
  BookOpen,
  Server,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  GitBranch,
  Layers,
  Zap,
  Library,
  History,
  AlertTriangle,
  Network,
  FlaskConical,
  Search,
  Map,
  Shield,
  TrendingUp,
  FolderKanban,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  badge?: string | number
  children?: NavItem[]
  highlight?: boolean
}

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: 'Projects',
    icon: <FolderOpen className="h-4 w-4" />,
    children: [
      { label: 'All Projects', href: '/projects', icon: <FolderKanban className="h-3.5 w-3.5" /> },
      { label: 'Create Project', href: '/projects/create', icon: <Plus className="h-3.5 w-3.5" />, highlight: true },
      { label: 'Releases', href: '/projects/releases', icon: <GitBranch className="h-3.5 w-3.5" /> },
      { label: 'Sprints', href: '/projects/sprints', icon: <Zap className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Requirements',
    icon: <FileText className="h-4 w-4" />,
    children: [
      { label: 'Repository', href: '/requirements', icon: <Layers className="h-3.5 w-3.5" /> },
      { label: 'Gap Analysis', href: '/requirements/gap-analysis', icon: <Search className="h-3.5 w-3.5" /> },
      { label: 'RTM', href: '/requirements/rtm', icon: <Network className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Test Planning',
    icon: <ClipboardList className="h-4 w-4" />,
    children: [
      { label: 'Test Strategy', href: '/test-planning/strategy', icon: <Map className="h-3.5 w-3.5" /> },
      { label: 'Test Plans', href: '/test-planning/plans', icon: <ClipboardList className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Test Cases',
    icon: <TestTube className="h-4 w-4" />,
    children: [
      { label: 'All Cases', href: '/test-cases', icon: <FlaskConical className="h-3.5 w-3.5" /> },
      { label: 'Generate with AI', href: '/test-cases/generate', icon: <Bot className="h-3.5 w-3.5" />, highlight: true },
      { label: 'Libraries', href: '/test-cases/libraries', icon: <Library className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Test Execution',
    icon: <Play className="h-4 w-4" />,
    children: [
      { label: 'Run Tests', href: '/test-execution', icon: <Play className="h-3.5 w-3.5" /> },
      { label: 'Results', href: '/test-execution/results', icon: <TrendingUp className="h-3.5 w-3.5" /> },
      { label: 'History', href: '/test-execution/history', icon: <History className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'Defect Management',
    icon: <Bug className="h-4 w-4" />,
    children: [
      { label: 'All Defects', href: '/defects', icon: <Bug className="h-3.5 w-3.5" /> },
      { label: 'AI Analysis', href: '/defects/analysis', icon: <Bot className="h-3.5 w-3.5" /> },
      { label: 'Reports', href: '/defects/reports', icon: <BarChart3 className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: 'AI Assistant',
    href: '/ai-assistant',
    icon: <Bot className="h-4 w-4" />,
    badge: 'AI',
    highlight: true,
  },
  {
    label: 'Reports & Analytics',
    href: '/reports',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: 'Knowledge Base',
    href: '/knowledge-base',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: 'Environment Monitor',
    href: '/environments',
    icon: <Server className="h-4 w-4" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />,
  },
]

function NavItemComponent({ item, depth = 0, collapsed }: { item: NavItem; depth?: number; collapsed: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(() => {
    if (!item.children) return false
    return item.children.some((child) => child.href && pathname.startsWith(child.href))
  })

  const isActive = item.href ? (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)) : false

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group',
            'text-slate-300 hover:bg-white/10 hover:text-white',
            open && 'bg-white/5 text-white',
            collapsed && 'justify-center px-2',
          )}
        >
          <span className="shrink-0 text-slate-400 group-hover:text-white">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {open ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 transition-transform" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              )}
            </>
          )}
        </button>
        {!collapsed && open && (
          <div className="mt-1 ml-4 pl-3 border-l border-white/10 space-y-0.5">
            {item.children.map((child) => (
              <NavItemComponent key={child.label} item={child} depth={depth + 1} collapsed={false} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group',
        isActive
          ? 'bg-[#f97316] text-white shadow-sm'
          : 'text-slate-300 hover:bg-white/10 hover:text-white',
        depth > 0 && 'text-xs',
        collapsed && 'justify-center px-2',
      )}
    >
      <span
        className={cn(
          'shrink-0 transition-colors',
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white',
        )}
      >
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 font-medium">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                item.highlight && !isActive
                  ? 'bg-[#f97316] text-white'
                  : 'bg-white/20 text-white',
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        'flex flex-col bg-[#0f2744] border-r border-[#1e3a5f] transition-all duration-300 shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-64',
        'shadow-sidebar',
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-[#1e3a5f] px-4', sidebarCollapsed && 'justify-center px-2')}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f97316]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">TestFlow</p>
              <p className="text-slate-400 text-xs">Enterprise</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f97316]">
            <Shield className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {navigation.map((item) => (
          <NavItemComponent key={item.label} item={item} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1e3a5f] p-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
