'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Bell, Settings, LogOut, User, ChevronDown,
  HelpCircle, CheckCircle2, AlertCircle, Info, X, Zap, FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockNotifications = [
  { id: '1', type: 'success' as const, title: 'Test Run Completed', message: 'Sprint 23 finished with 94% pass rate', read: false, time: '10m ago' },
  { id: '2', type: 'error' as const, title: 'Critical Defect Detected', message: 'DEF-0142: Payment gateway returns 500', read: false, time: '45m ago' },
  { id: '3', type: 'info' as const, title: 'AI Analysis Complete', message: 'Gap analysis found 3 missing requirements', read: true, time: '2h ago' },
  { id: '4', type: 'warning' as const, title: 'Environment Degraded', message: 'Staging API response time increased to 3.2s', read: true, time: '3h ago' },
];

const notifIcon: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  error: <AlertCircle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
  warning: <AlertCircle className="w-4 h-4 text-yellow-500" />,
};

export default function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotifOpen(false); setUserOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Mock user
  const user = { name: 'Iskander Qasem', email: 'iskanderqasem@gmail.com', role: 'Test Manager', initials: 'IQ' };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-4 shrink-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-3 w-full max-w-md h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm hover:border-blue-300 hover:bg-white transition-colors"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search projects, test cases, defects…</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-white text-xs text-gray-400 font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* Quick Create */}
        <Link href="/projects/create" className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors">
          <Zap className="h-3.5 w-3.5" /> Quick Create
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }} className="relative h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-4 w-4 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-3.5 w-3.5" /></button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className={cn('flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer', !n.read && 'bg-blue-50/40')}>
                      <div className="shrink-0 mt-0.5">{notifIcon[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="shrink-0 mt-2 h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help */}
        <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <HelpCircle className="h-4 w-4 text-gray-600" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        {/* User Menu */}
        <div className="relative">
          <button onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-500">{user.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden md:block" />
          </button>
          {userOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  {[
                    { icon: User, label: 'My Profile', href: '/profile' },
                    { icon: FolderOpen, label: 'My Projects', href: '/projects' },
                    { icon: Settings, label: 'Settings', href: '/settings' },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link key={href} href={href} onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Icon className="w-4 h-4 text-gray-400" /> {label}
                    </Link>
                  ))}
                  <div className="h-px bg-gray-100 my-1" />
                  <button onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-20" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <Search className="h-5 w-5 text-gray-400 shrink-0" />
              <input ref={searchRef} type="text" placeholder="Search projects, test cases, defects, requirements…" className="flex-1 text-sm outline-none placeholder:text-gray-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4">
              {!searchQuery ? (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Links</p>
                  <div className="space-y-1">
                    {[
                      { label: 'All Projects', href: '/projects', icon: FolderOpen },
                      { label: 'AI Assistant', href: '/ai-assistant', icon: Zap },
                      { label: 'Generate Test Cases', href: '/test-cases/generate', icon: Search },
                    ].map(({ label, href, icon: Icon }) => (
                      <Link key={href} href={href} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">Searching for &quot;{searchQuery}&quot;…</p>
              )}
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
              <span>↵ select</span><span>↑↓ navigate</span><span>ESC close</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
