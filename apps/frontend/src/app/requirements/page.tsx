'use client';
import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, AlertTriangle, CheckCircle2, Clock, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import toast from '@/lib/toast';
const reqs = [
  { id: 'REQ-001', title: 'User authentication with MFA support', priority: 'High', status: 'Approved', coverage: 92, module: 'Auth', author: 'IQ' },
  { id: 'REQ-002', title: 'Payment processing with PCI-DSS compliance', priority: 'Critical', status: 'In Review', coverage: 67, module: 'Payment', author: 'SA' },
  { id: 'REQ-003', title: 'Real-time notifications via WebSocket', priority: 'Medium', status: 'Approved', coverage: 45, module: 'Notifications', author: 'MK' },
  { id: 'REQ-004', title: 'Export reports to PDF and Excel formats', priority: 'Low', status: 'Draft', coverage: 0, module: 'Reports', author: 'IQ' },
  { id: 'REQ-005', title: 'Role-based access control (RBAC)', priority: 'High', status: 'Approved', coverage: 88, module: 'Auth', author: 'SA' },
  { id: 'REQ-006', title: 'API rate limiting and throttling', priority: 'Medium', status: 'Draft', coverage: 0, module: 'API', author: 'MK' },
];
const priorityColor: Record<string,string> = { Critical:'bg-red-100 text-red-700', High:'bg-orange-100 text-orange-700', Medium:'bg-yellow-100 text-yellow-700', Low:'bg-gray-100 text-gray-600' };
const statusColor: Record<string,string> = { Approved:'bg-green-100 text-green-700', 'In Review':'bg-blue-100 text-blue-700', Draft:'bg-gray-100 text-gray-600' };
export default function RequirementsPage() {
  const [search, setSearch] = useState('');
  const filtered = reqs.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Requirements</h1><p className="text-sm text-gray-400 mt-0.5">{reqs.length} requirements across all projects</p></div>
        <div className="flex gap-2">
          <Link href="/requirements/gap-analysis" className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-purple-300 text-purple-700 text-xs font-semibold hover:bg-purple-50 transition-colors"><Zap className="h-3.5 w-3.5" />AI Gap Analysis</Link>
          <button onClick={() => toast.success('Requirement created')} className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#162b47] transition-colors"><Plus className="h-3.5 w-3.5" />New Requirement</button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[{label:'Total',value:reqs.length,color:'text-[#1e3a5f]'},{label:'Approved',value:reqs.filter(r=>r.status==='Approved').length,color:'text-green-600'},{label:'In Review',value:reqs.filter(r=>r.status==='In Review').length,color:'text-blue-600'},{label:'Draft',value:reqs.filter(r=>r.status==='Draft').length,color:'text-gray-500'}].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4"><p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p></div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs"><Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search requirements…" className="w-full h-8 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50"><Filter className="h-3.5 w-3.5" />Filter</button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">ID</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Title</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Priority</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Status</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Coverage</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500">Module</th></tr></thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-5 py-3"><span className="text-xs font-mono font-bold text-[#1e3a5f]">{r.id}</span></td>
                <td className="px-3 py-3 max-w-xs"><p className="text-sm font-medium text-gray-800 truncate">{r.title}</p></td>
                <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${priorityColor[r.priority]}`}>{r.priority}</span></td>
                <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColor[r.status]}`}>{r.status}</span></td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${r.coverage>80?'bg-green-500':r.coverage>40?'bg-yellow-400':'bg-gray-300'}`} style={{width:`${r.coverage}%`}} /></div><span className="text-xs text-gray-500 w-8">{r.coverage}%</span></div>
                </td>
                <td className="px-3 py-3"><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{r.module}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
