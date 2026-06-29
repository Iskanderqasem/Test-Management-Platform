'use client';

import { CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';

const RTM_DATA = [
  { req: 'REQ-001', reqTitle: 'User Authentication', testCases: ['TC-001', 'TC-002', 'TC-009', 'TC-010'], defects: [], status: 'covered', coverage: 100 },
  { req: 'REQ-002', reqTitle: 'Session Management', testCases: ['TC-003', 'TC-004'], defects: ['DEF-004'], status: 'covered', coverage: 85 },
  { req: 'REQ-003', reqTitle: 'Real-time Billing Update', testCases: ['TC-005'], defects: ['DEF-002'], status: 'partial', coverage: 45 },
  { req: 'REQ-004', reqTitle: 'API Rate Limiting', testCases: ['TC-006'], defects: ['DEF-003'], status: 'covered', coverage: 90 },
  { req: 'REQ-005', reqTitle: 'VoLTE Call Quality', testCases: ['TC-007'], defects: ['DEF-001', 'DEF-006'], status: 'partial', coverage: 60 },
  { req: 'REQ-006', reqTitle: 'GDPR Data Compliance', testCases: ['TC-008'], defects: ['DEF-005'], status: 'covered', coverage: 91 },
  { req: 'REQ-007', reqTitle: 'IMS Failover Handling', testCases: [], defects: [], status: 'missing', coverage: 0 },
  { req: 'REQ-008', reqTitle: 'SIM Provisioning Workflow', testCases: [], defects: [], status: 'missing', coverage: 0 },
];

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  covered: { label: 'Covered', icon: CheckCircle2, color: 'text-green-600' },
  partial: { label: 'Partial', icon: AlertCircle, color: 'text-yellow-600' },
  missing: { label: 'No Coverage', icon: XCircle, color: 'text-red-600' },
};

export default function RTMPage() {
  const covered = RTM_DATA.filter((r) => r.status === 'covered').length;
  const partial = RTM_DATA.filter((r) => r.status === 'partial').length;
  const missing = RTM_DATA.filter((r) => r.status === 'missing').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requirements Traceability Matrix</h1>
          <p className="text-gray-500 mt-1">Linking requirements → test cases → defects → results</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" /> Export RTM
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Fully Covered', value: covered, color: 'text-green-600' },
          { label: 'Partial Coverage', value: partial, color: 'text-yellow-600' },
          { label: 'No Coverage', value: missing, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Requirement', 'Title', 'Test Cases', 'Defects', 'Coverage', 'Status'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {RTM_DATA.map((row) => {
              const { label, icon: Icon, color } = statusConfig[row.status];
              return (
                <tr key={row.req} className={`hover:bg-gray-50 ${row.status === 'missing' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700 font-medium">{row.req}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.reqTitle}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.testCases.length > 0
                        ? row.testCases.map((tc) => <span key={tc} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">{tc}</span>)
                        : <span className="text-xs text-red-400">None</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {row.defects.length > 0
                        ? row.defects.map((d) => <span key={d} className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono">{d}</span>)
                        : <span className="text-xs text-gray-300">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${row.coverage >= 80 ? 'bg-green-500' : row.coverage >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${row.coverage}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{row.coverage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
