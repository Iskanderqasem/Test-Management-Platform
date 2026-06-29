'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bug, Plus, Filter, Search, ExternalLink, Sparkles } from 'lucide-react';

const DEFECTS = [
  { id: 'DEF-001', title: 'VoLTE call drops after 30 seconds on IMS migration env', severity: 'Critical', priority: 'P1', status: 'Open', env: 'SIT', reporter: 'Sarah Chen', assignee: 'Dev Team B', created: '2026-06-25', req: 'REQ-005', tc: 'TC-007' },
  { id: 'DEF-002', title: 'Billing system throws NPE when concurrent sessions > 100', severity: 'High', priority: 'P2', status: 'In Progress', env: 'UAT', reporter: 'James Patel', assignee: 'Backend Team', created: '2026-06-26', req: 'REQ-003', tc: 'TC-005' },
  { id: 'DEF-003', title: 'API returns 500 instead of 429 on rate limit breach', severity: 'Medium', priority: 'P2', status: 'Fixed', env: 'SIT', reporter: 'Li Wei', assignee: 'API Team', created: '2026-06-20', req: 'REQ-004', tc: 'TC-006' },
  { id: 'DEF-004', title: 'Session does not expire on mobile clients after 30 min', severity: 'High', priority: 'P2', status: 'Retest', env: 'SIT', reporter: 'Omar Hassan', assignee: 'Auth Team', created: '2026-06-22', req: 'REQ-002', tc: 'TC-004' },
  { id: 'DEF-005', title: 'GDPR deletion confirmation email not triggered', severity: 'Medium', priority: 'P3', status: 'Closed', env: 'UAT', reporter: 'Sarah Chen', assignee: 'Backend Team', created: '2026-06-18', req: 'REQ-006', tc: 'TC-008' },
  { id: 'DEF-006', title: 'VoWiFi handover causes 2s call interruption instead of <300ms', severity: 'High', priority: 'P1', status: 'Open', env: 'SIT', reporter: 'Li Wei', assignee: 'Network Team', created: '2026-06-28', req: 'REQ-005', tc: 'TC-005' },
];

const severityColor: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200',
};

const statusColor: Record<string, string> = {
  Open: 'bg-red-50 text-red-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Fixed: 'bg-green-50 text-green-700',
  Retest: 'bg-purple-50 text-purple-700',
  Closed: 'bg-gray-100 text-gray-500',
};

export default function DefectsPage() {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = DEFECTS.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    const matchSev = !filterSeverity || d.severity === filterSeverity;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchSev && matchStatus;
  });

  const stats = { total: DEFECTS.length, open: DEFECTS.filter((d) => d.status === 'Open').length, critical: DEFECTS.filter((d) => d.severity === 'Critical').length, closed: DEFECTS.filter((d) => d.status === 'Closed').length };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Defect Management</h1>
          <p className="text-gray-500 mt-1">{stats.open} open defects · {stats.critical} critical</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <ExternalLink className="w-4 h-4" /> Export to ADO
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <ExternalLink className="w-4 h-4" /> Export to Jira
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium">
            <Plus className="w-4 h-4" /> Log Defect
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Open', value: stats.open, color: 'text-red-600' },
          { label: 'Critical', value: stats.critical, color: 'text-red-700' },
          { label: 'Closed', value: stats.closed, color: 'text-green-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search defects…" className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 w-64" />
        </div>
        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
          <option value="">All Severities</option>
          {['Critical', 'High', 'Medium', 'Low'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
          <option value="">All Statuses</option>
          {['Open', 'In Progress', 'Fixed', 'Retest', 'Closed'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['ID', 'Title', 'Severity', 'Priority', 'Status', 'Environment', 'Reporter', 'Assignee', 'Created'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-3">
                  <Link href={`/defects/${d.id}`} className="font-mono text-xs text-red-600 font-medium hover:underline">{d.id}</Link>
                </td>
                <td className="px-4 py-3 text-gray-800 max-w-xs">
                  <Link href={`/defects/${d.id}`} className="hover:text-blue-700">
                    <p className="truncate">{d.title}</p>
                  </Link>
                </td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${severityColor[d.severity]}`}>{d.severity}</span></td>
                <td className="px-4 py-3"><span className="text-xs font-bold text-gray-700">{d.priority}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[d.status]}`}>{d.status}</span></td>
                <td className="px-4 py-3 text-xs text-gray-500">{d.env}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{d.reporter}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{d.assignee}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{d.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
