'use client';

import { useState } from 'react';
import { FileText, Download, Plus, Calendar, Sparkles, BarChart3, Bug, TestTube2, Shield, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
  { id: 'daily', label: 'Daily Status Report', icon: Calendar, desc: 'Daily execution summary, defect count, blockers', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'weekly', label: 'Weekly Progress Report', icon: BarChart3, desc: 'Weekly trends, coverage, team velocity', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'release', label: 'Release Readiness Report', icon: Shield, desc: 'Go/no-go recommendation with risk assessment', color: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'execution', label: 'Test Execution Report', icon: TestTube2, desc: 'Detailed pass/fail breakdown by module', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'defect', label: 'Defect Summary Report', icon: Bug, desc: 'Defect trends, aging, severity distribution', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'coverage', label: 'Coverage Report', icon: BarChart3, desc: 'Requirement-to-test traceability and gaps', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
];

const RECENT_REPORTS = [
  { name: 'Daily Status — 28 Jun 2026', type: 'Daily', generated: '2026-06-28', format: 'PDF', size: '245KB' },
  { name: 'IMS Migration Weekly Report W26', type: 'Weekly', generated: '2026-06-27', format: 'Word', size: '1.2MB' },
  { name: 'Release Readiness — Billing v3 RC1', type: 'Release', generated: '2026-06-25', format: 'PDF', size: '890KB' },
  { name: 'Execution Report — Sprint 4', type: 'Execution', generated: '2026-06-24', format: 'PDF', size: '512KB' },
  { name: 'Defect Summary — IMS Migration', type: 'Defect', generated: '2026-06-22', format: 'Excel', size: '320KB' },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [project, setProject] = useState('5G Core Upgrade');

  const generate = async (type: string) => {
    setGenerating(type);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(null);
    toast.success('Report generated and ready to download');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Generate AI-powered professional reports</p>
        </div>
        <select value={project} onChange={(e) => setProject(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
          {['5G Core Upgrade', 'Billing System v3', 'VoLTE Enhancement', 'IMS Migration'].map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Generate Report</h2>
        <div className="grid grid-cols-3 gap-4">
          {REPORT_TYPES.map((r) => (
            <div key={r.id} className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${r.color}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${r.color}`}>
                  <r.icon className="w-5 h-5" />
                </div>
                <div className="flex gap-1">
                  {['PDF', 'Word', 'Excel'].map((fmt) => (
                    <span key={fmt} className="text-xs px-1.5 py-0.5 bg-white bg-opacity-70 rounded text-gray-600">{fmt}</span>
                  ))}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{r.label}</h3>
              <p className="text-xs text-gray-500 mb-4">{r.desc}</p>
              <button
                onClick={() => generate(r.id)}
                disabled={generating === r.id}
                className="w-full py-1.5 bg-white border border-current rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-opacity-90 transition-colors disabled:opacity-60"
              >
                {generating === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {generating === r.id ? 'Generating…' : 'Generate with AI'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Reports</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Report Name', 'Type', 'Generated', 'Format', 'Size', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RECENT_REPORTS.map((r) => (
                <tr key={r.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />{r.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.type}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.generated}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{r.format}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{r.size}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 text-xs text-blue-700 hover:underline">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
