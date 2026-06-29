'use client';

import { useState } from 'react';
import { Plus, Search, Filter, FolderKanban, Users, Calendar, MoreHorizontal, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const PROJECTS = [
  { id: '1', name: '5G Core Upgrade', description: 'Full 5G NSA/SA core upgrade including IMS, HSS, and PCF components', status: 'In Progress', phase: 'Execution', owner: 'Sarah Chen', team: 8, startDate: '2026-05-01', endDate: '2026-08-30', testCases: 340, passed: 245, failed: 18, coverage: 82, health: 'good' },
  { id: '2', name: 'Billing System v3', description: 'Next-gen billing system with real-time charging and converged billing', status: 'UAT', phase: 'UAT', owner: 'James Patel', team: 6, startDate: '2026-04-01', endDate: '2026-07-15', testCases: 210, passed: 185, failed: 14, coverage: 91, health: 'warning' },
  { id: '3', name: 'VoLTE Enhancement', description: 'VoLTE quality improvements and HD Voice codec upgrade', status: 'Planning', phase: 'Planning', owner: 'Li Wei', team: 4, startDate: '2026-06-15', endDate: '2026-09-30', testCases: 120, passed: 30, failed: 2, coverage: 25, health: 'good' },
  { id: '4', name: 'IMS Migration', description: 'On-premise IMS to cloud-native IMS migration with zero-downtime', status: 'Execution', phase: 'System Test', owner: 'Omar Hassan', team: 12, startDate: '2026-03-01', endDate: '2026-07-31', testCases: 480, passed: 260, failed: 31, coverage: 54, health: 'critical' },
];

const healthBadge: Record<string, string> = {
  good: 'bg-green-100 text-green-700 border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const phaseBadge: Record<string, string> = {
  Planning: 'bg-purple-100 text-purple-700',
  Execution: 'bg-blue-100 text-blue-700',
  UAT: 'bg-orange-100 text-orange-700',
  'System Test': 'bg-indigo-100 text-indigo-700',
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  const filtered = PROJECTS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">{PROJECTS.length} active projects</p>
        </div>
        <Link
          href="/projects/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: 4, sub: '2 on track' },
          { label: 'Test Cases', value: '1,150', sub: 'across all projects' },
          { label: 'Open Defects', value: 65, sub: '4 critical' },
          { label: 'Avg Coverage', value: '63%', sub: 'target: 85%' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((p) => (
          <Link key={p.id} href={`/projects/${p.id}`} className="block">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200 cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FolderKanban className="w-5 h-5 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.description}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${healthBadge[p.health]}`}>{p.status}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${phaseBadge[p.phase] ?? 'bg-gray-100 text-gray-600'}`}>{p.phase}</span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Coverage</span>
                  <span>{p.coverage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${p.health === 'critical' ? 'bg-red-500' : p.health === 'warning' ? 'bg-yellow-500' : 'bg-blue-900'}`}
                    style={{ width: `${p.coverage}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-center border-t border-gray-100 pt-3">
                <div>
                  <p className="text-xs text-gray-400">Test Cases</p>
                  <p className="text-sm font-semibold text-gray-800">{p.testCases}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Passed</p>
                  <p className="text-sm font-semibold text-green-600">{p.passed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Failed</p>
                  <p className="text-sm font-semibold text-red-600">{p.failed}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.team} members</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due {p.endDate}</span>
                <span className="flex items-center gap-1 text-gray-600"><TrendingUp className="w-3 h-3 text-blue-600" /> {p.owner}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
