'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, Search, ChevronRight } from 'lucide-react';

const PLANS = [
  { id: 1, name: 'Payment Gateway v3.2 — System Test Plan', project: 'Payment Gateway', status: 'Approved', version: '1.2', createdBy: 'Sarah Chen', updatedAt: '2026-06-28', sections: 26 },
  { id: 2, name: 'Mobile App 4.0 — Regression Test Plan', project: 'Mobile App', status: 'In Review', version: '0.9', createdBy: 'James Patel', updatedAt: '2026-06-27', sections: 22 },
  { id: 3, name: 'API Gateway — Integration Test Plan', project: 'API Gateway', status: 'Draft', version: '0.3', createdBy: 'Maria Gonzalez', updatedAt: '2026-06-25', sections: 14 },
  { id: 4, name: 'Customer Portal — UAT Plan', project: 'Customer Portal', status: 'Approved', version: '2.0', createdBy: 'Liam O\'Brien', updatedAt: '2026-06-20', sections: 26 },
  { id: 5, name: 'Data Migration — Test Plan', project: 'Data Migration', status: 'Archived', version: '1.0', createdBy: 'Priya Sharma', updatedAt: '2026-05-15', sections: 18 },
];

const statusColor: Record<string, string> = {
  Approved: 'bg-green-100 text-green-700',
  'In Review': 'bg-yellow-100 text-yellow-700',
  Draft: 'bg-gray-100 text-gray-500',
  Archived: 'bg-slate-100 text-slate-500',
};

export default function TestPlansPage() {
  const [search, setSearch] = useState('');
  const filtered = PLANS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.project.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Test Plans</h1>
          <p className="text-sm text-gray-400">Manage and create comprehensive test plans</p>
        </div>
        <Link href="/test-planning/plans/create"
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors">
          <Plus className="h-4 w-4" /> New Test Plan
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Plans', value: PLANS.length },
          { label: 'Approved', value: PLANS.filter(p => p.status === 'Approved').length },
          { label: 'In Review', value: PLANS.filter(p => p.status === 'In Review').length },
          { label: 'Draft', value: PLANS.filter(p => p.status === 'Draft').length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Plan Name</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Version</th>
              <th className="px-4 py-3 text-left">Sections</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(plan => (
              <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-300 shrink-0" />
                    <span className="font-medium text-gray-900">{plan.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{plan.project}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[plan.status]}`}>{plan.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">v{plan.version}</td>
                <td className="px-4 py-3 text-gray-500">{plan.sections}/26</td>
                <td className="px-4 py-3 text-gray-500">{plan.createdBy}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{plan.updatedAt}</td>
                <td className="px-4 py-3">
                  <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
