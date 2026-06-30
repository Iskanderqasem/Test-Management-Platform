'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, Filter, Search, Download, CheckSquare, ChevronDown } from 'lucide-react';

const TEST_CASES = [
  { id: 'TC-001', title: 'Valid user login with correct credentials', type: 'Functional', priority: 'High', status: 'Pass', automated: true, req: 'REQ-001', sprint: 'Sprint 3' },
  { id: 'TC-002', title: 'Invalid login â€” wrong password shows error', type: 'Negative', priority: 'High', status: 'Pass', automated: true, req: 'REQ-001', sprint: 'Sprint 3' },
  { id: 'TC-003', title: 'Account lockout after 5 failed attempts', type: 'Security', priority: 'Critical', status: 'Fail', automated: false, req: 'REQ-002', sprint: 'Sprint 3' },
  { id: 'TC-004', title: 'Session expires after 30 minutes inactivity', type: 'Functional', priority: 'Medium', status: 'Pass', automated: true, req: 'REQ-002', sprint: 'Sprint 3' },
  { id: 'TC-005', title: 'Billing update reflects within 5 seconds', type: 'Performance', priority: 'High', status: 'Blocked', automated: false, req: 'REQ-003', sprint: 'Sprint 4' },
  { id: 'TC-006', title: 'API returns 429 when rate limit exceeded', type: 'Functional', priority: 'High', status: 'Pass', automated: true, req: 'REQ-004', sprint: 'Sprint 4' },
  { id: 'TC-007', title: 'VoLTE call quality MOS score >= 3.5', type: 'Performance', priority: 'Critical', status: 'Not Run', automated: false, req: 'REQ-005', sprint: 'Sprint 5' },
  { id: 'TC-008', title: 'GDPR data deletion request processed within 72h', type: 'Compliance', priority: 'Critical', status: 'Pass', automated: false, req: 'REQ-006', sprint: 'Sprint 4' },
  { id: 'TC-009', title: 'Boundary: maximum password length 128 chars', type: 'Boundary', priority: 'Medium', status: 'Pass', automated: true, req: 'REQ-001', sprint: 'Sprint 3' },
  { id: 'TC-010', title: 'Negative: SQL injection in login fields', type: 'Security', priority: 'Critical', status: 'Pass', automated: true, req: 'REQ-002', sprint: 'Sprint 3' },
];

const statusColor: Record<string, string> = {
  Pass: 'bg-green-100 text-green-700',
  Fail: 'bg-red-100 text-red-700',
  Blocked: 'bg-orange-100 text-orange-700',
  'Not Run': 'bg-gray-100 text-gray-500',
  Skipped: 'bg-purple-100 text-purple-600',
};

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const typeColor: Record<string, string> = {
  Functional: 'bg-blue-100 text-blue-700',
  Negative: 'bg-rose-100 text-rose-700',
  Security: 'bg-purple-100 text-purple-700',
  Performance: 'bg-cyan-100 text-cyan-700',
  Boundary: 'bg-indigo-100 text-indigo-700',
  Compliance: 'bg-teal-100 text-teal-700',
};

export default function TestCasesPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = TEST_CASES.filter((tc) => {
    const matchSearch = tc.title.toLowerCase().includes(search.toLowerCase()) || tc.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || tc.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const toggle = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const stats = {
    total: TEST_CASES.length,
    pass: TEST_CASES.filter((t) => t.status === 'Pass').length,
    fail: TEST_CASES.filter((t) => t.status === 'Fail').length,
    notRun: TEST_CASES.filter((t) => t.status === 'Not Run').length,
    automated: TEST_CASES.filter((t) => t.automated).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Cases</h1>
          <p className="text-gray-500 mt-1">{stats.total} test cases across all modules</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Add Manual
          </button>
          <Link href="/test-cases/generate" className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
            <Sparkles className="w-4 h-4" /> AI Generate
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900' },
          { label: 'Passed', value: stats.pass, color: 'text-green-600' },
          { label: 'Failed', value: stats.fail, color: 'text-red-600' },
          { label: 'Not Run', value: stats.notRun, color: 'text-gray-400' },
          { label: 'Automated', value: `${stats.automated} (${Math.round(stats.automated / stats.total * 100)}%)`, color: 'text-blue-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder="Search test casesâ€¦" className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 w-64" />
        </div>
        <select value={filterStatus} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
          <option value="">All Statuses</option>
          {['Pass', 'Fail', 'Blocked', 'Not Run', 'Skipped'].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Filter className="w-4 h-4" /> More Filters</button>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">{selected.length} selected</span>
            <button className="px-3 py-1.5 text-xs bg-blue-900 text-white rounded-lg">Run Selected</button>
            <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600"><Download className="w-3.5 h-3.5 inline mr-1" />Export</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-8">
                <input type="checkbox" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelected(e.target.checked ? filtered.map((t) => t.id) : [])} className="accent-blue-900" />
              </th>
              {['ID', 'Title', 'Type', 'Priority', 'Status', 'Automated', 'Requirement', 'Sprint'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((tc) => (
              <tr key={tc.id} className={`hover:bg-gray-50 cursor-pointer ${selected.includes(tc.id) ? 'bg-blue-50' : ''}`} onClick={() => toggle(tc.id)}>
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(tc.id)} readOnly className="accent-blue-900" /></td>
                <td className="px-4 py-3 font-mono text-xs text-blue-700 font-medium">{tc.id}</td>
                <td className="px-4 py-3 text-gray-800 max-w-xs">
                  <p className="truncate">{tc.title}</p>
                </td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[tc.type] ?? 'bg-gray-100 text-gray-600'}`}>{tc.type}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[tc.priority]}`}>{tc.priority}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[tc.status]}`}>{tc.status}</span></td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${tc.automated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{tc.automated ? 'âœ“' : 'â€”'}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-gray-500">{tc.req}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{tc.sprint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

