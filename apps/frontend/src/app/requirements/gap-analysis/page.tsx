'use client';

import { AlertTriangle, XCircle, HelpCircle, Shield, Zap, Accessibility, CheckCircle2, Download } from 'lucide-react';

const GAPS = [
  { category: 'Missing Requirements', severity: 'High', count: 4, items: ['No requirement for SIM card deactivation workflow', 'Missing requirement for concurrent session limits', 'No specification for data retention policy', 'Missing API versioning strategy requirement'] },
  { category: 'Conflicting Requirements', severity: 'Critical', count: 2, items: ['REQ-012 specifies 5s response time; REQ-045 specifies 2s for same API', 'REQ-021 allows guest access; REQ-034 mandates authentication for all endpoints'] },
  { category: 'Missing Acceptance Criteria', severity: 'High', count: 7, items: ['REQ-003: No measurable criteria for billing accuracy', 'REQ-007: No definition of "acceptable" call quality', 'REQ-011: No error rate threshold defined', '+ 4 more'] },
  { category: 'Missing Business Rules', severity: 'Medium', count: 3, items: ['What happens when a customer has multiple active subscriptions?', 'No rule defined for prorated billing on mid-cycle upgrades', 'Roaming billing rules not documented'] },
  { category: 'Security Risks', severity: 'Critical', count: 3, items: ['No requirement for API authentication token expiry', 'Missing input sanitization requirements for all user inputs', 'No requirement for audit logging of privileged actions'] },
  { category: 'Performance Risks', severity: 'High', count: 2, items: ['No performance SLA defined for provisioning under peak load (>10K concurrent)', 'Billing calculation has no throughput requirement specified'] },
  { category: 'Missing Integrations', severity: 'Medium', count: 3, items: ['Integration with PCRF not documented', 'No requirement for SNMP alerts to monitoring system', 'Missing integration specification with billing mediation layer'] },
  { category: 'Clarification Required', severity: 'Low', count: 8, items: ['What is the timeout behavior when HLR is unreachable?', 'Which customer segments are in scope for the new billing engine?', '+ 6 more questions'] },
];

const severityConfig: Record<string, { color: string; bg: string; icon: any }> = {
  Critical: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle },
  High: { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: AlertTriangle },
  Medium: { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: AlertTriangle },
  Low: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: HelpCircle },
};

const categoryIcon: Record<string, any> = {
  'Missing Requirements': AlertTriangle,
  'Conflicting Requirements': XCircle,
  'Missing Acceptance Criteria': CheckCircle2,
  'Missing Business Rules': Shield,
  'Security Risks': Shield,
  'Performance Risks': Zap,
  'Missing Integrations': AlertTriangle,
  'Clarification Required': HelpCircle,
};

export default function GapAnalysisPage() {
  const total = GAPS.reduce((s, g) => s + g.count, 0);
  const critical = GAPS.filter((g) => g.severity === 'Critical').reduce((s, g) => s + g.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Requirement Gap Analysis</h1>
          <p className="text-gray-500 mt-1">Automated analysis identified {total} gaps across 8 categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Gaps', value: total, color: 'text-gray-900' },
          { label: 'Critical', value: critical, color: 'text-red-600' },
          { label: 'High Risk', value: GAPS.filter((g) => g.severity === 'High').reduce((s, g) => s + g.count, 0), color: 'text-orange-600' },
          { label: 'Questions', value: 8, color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Gap Items */}
      <div className="grid grid-cols-2 gap-4">
        {GAPS.map((gap) => {
          const { color, bg, icon: Icon } = severityConfig[gap.severity];
          const CatIcon = categoryIcon[gap.category] ?? AlertTriangle;
          return (
            <div key={gap.category} className={`rounded-xl border p-5 ${bg}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CatIcon className={`w-4 h-4 ${color}`} />
                  <h3 className={`font-semibold ${color}`}>{gap.category}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  <span className={`text-xs font-medium ${color}`}>{gap.severity}</span>
                  <span className={`text-xs font-bold ml-1 px-2 py-0.5 rounded-full bg-white ${color}`}>{gap.count}</span>
                </div>
              </div>
              <ul className="space-y-1.5">
                {gap.items.map((item, i) => (
                  <li key={i} className={`text-sm flex items-start gap-2 ${color}`}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
