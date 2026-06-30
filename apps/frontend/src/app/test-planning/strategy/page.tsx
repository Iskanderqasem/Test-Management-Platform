'use client';
import React, { useState } from 'react';
import { Zap, FileText, Download, Layout, ChevronDown, ChevronRight } from 'lucide-react';
import toast from '@/lib/toast';

const TEMPLATE_DEFAULTS = {
  project: 'My Project',
  scope: 'End-to-end functional, integration, and performance testing covering all user-facing features and API endpoints as defined in the approved FRS.',
  riskLevel: 'high',
  approach: 'risk-based',
};

const SAVED_STRATEGIES = [
  { id: 1, project: 'Payment Gateway v3', approach: 'Risk-Based', risk: 'Critical', date: '2026-06-28', sections: 11 },
  { id: 2, project: 'Mobile App 4.0', approach: 'Agile Sprint', risk: 'High', date: '2026-06-20', sections: 11 },
];

function buildStrategy(form: { project: string; scope: string; riskLevel: string; approach: string }) {
  return [
    { title: '1. Scope & Objectives', content: `This strategy covers all testing activities for ${form.project}. ${form.scope} Objective: achieve 95%+ requirement coverage with zero critical defects at release.` },
    { title: '2. Risk Assessment', content: `Risk Level: ${form.riskLevel.toUpperCase()}. High-risk areas: authentication, data integrity, payment flows, third-party integrations. Mitigation: dedicated test cycles, automated regression, exploratory sessions on high-risk modules.` },
    { title: '3. Test Levels — Unit', content: 'Owned by the development team. Coverage target: 80% code coverage. Tools: Jest / Vitest. Run on every pull request via CI pipeline.' },
    { title: '4. Test Levels — Integration', content: 'API contract testing and service-to-service integration. Owned by QA. Tools: Postman / Newman, Pact for contract testing. Run nightly.' },
    { title: '5. Test Levels — System', content: `End-to-end functional testing across all ${form.project} modules. Covers happy paths, negative scenarios, and boundary conditions. Tools: Playwright. Run on QA environment.` },
    { title: '6. Test Levels — UAT', content: 'Business stakeholder validation sessions. Acceptance criteria derived from user stories. Facilitated by Test Manager. Sign-off required before release.' },
    { title: '7. Test Levels — Performance', content: 'Load testing: 1000 concurrent users. Stress testing to 150% expected peak. Spike test for sudden traffic bursts. Tools: k6. Target: p95 response < 500ms.' },
    { title: '8. Test Types', content: 'Functional, Regression, Smoke, Sanity, Exploratory, Security (OWASP Top 10), Accessibility (WCAG 2.1 AA), Compatibility (browsers + devices).' },
    { title: '9. Automation Strategy', content: 'Target 70% automation coverage. Priority: smoke suite (daily), regression suite (each release), API contracts (every merge). Framework: Playwright + TypeScript. CI: GitHub Actions.' },
    { title: '10. Resource Plan', content: '1 Test Manager, 1 Senior QA, 3 QA Engineers. Estimated effort: 120 person-days. Tools budget includes TestOS, Jira, BrowserStack.' },
    { title: '11. Entry / Exit Criteria & Defect Management & Reporting', content: `Entry: requirements approved, dev complete, env ready, smoke passing.\nExit: 95% test cases executed, zero severity-1 defects, all high defects resolved.\nDefect SLA: Critical 4h, High 1d, Medium 3d.\nReporting: daily dashboard in TestOS, weekly status email, final test summary report pre-release.` },
  ];
}

export default function TestStrategyPage() {
  const [form, setForm] = useState({ project: '', scope: '', riskLevel: 'medium', approach: 'risk-based' });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSaved, setExpandedSaved] = useState<number | null>(null);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const applyTemplate = () => {
    setForm(TEMPLATE_DEFAULTS);
    toast.success('Template loaded');
  };

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setGenerated(true); setLoading(false); toast.success('Test strategy generated!'); }, 1800);
  };

  const strategy = buildStrategy(form);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Test Strategy</h1>
          <p className="text-sm text-gray-400">AI-powered test strategy generation</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Form */}
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-purple-600" />Generate Strategy</h2>
          <button onClick={applyTemplate} className="w-full flex items-center justify-center gap-2 h-8 mb-4 rounded-lg border border-gray-200 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
            <Layout className="h-3.5 w-3.5" /> Use Template
          </button>
          <form onSubmit={generate} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Project Name</label>
              <input required value={form.project} onChange={e => set('project', e.target.value)} placeholder="e.g. Payment Gateway"
                className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Scope & Objectives</label>
              <textarea value={form.scope} onChange={e => set('scope', e.target.value)} rows={3} placeholder="Describe what needs to be tested…"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none" />
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Risk Level</label>
              <select value={form.riskLevel} onChange={e => set('riskLevel', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white appearance-none">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Test Approach</label>
              <select value={form.approach} onChange={e => set('approach', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white appearance-none">
                <option value="risk-based">Risk-Based</option><option value="requirement-based">Requirement-Based</option><option value="exploratory">Exploratory</option><option value="agile">Agile Sprint</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full h-9 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</> : <><Zap className="h-3.5 w-3.5" />Generate with AI</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          {generated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Generated Strategy: {form.project}</h2>
                <button onClick={() => toast.success('Downloaded')} className="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                  <Download className="h-3 w-3" />Export
                </button>
              </div>
              {strategy.map(s => (
                <div key={s.title} className="border-l-2 border-[#1e3a5f] pl-4">
                  <p className="text-sm font-bold text-gray-900">{s.title}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{s.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4"><FileText className="h-8 w-8 text-gray-300" /></div>
              <p className="text-sm font-semibold text-gray-500">Fill in the form and click Generate</p>
              <p className="text-xs text-gray-400 mt-1">AI will create an 11-section test strategy</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Strategies */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Saved Strategies</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {SAVED_STRATEGIES.map(s => (
            <div key={s.id}>
              <button onClick={() => setExpandedSaved(expandedSaved === s.id ? null : s.id)}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors text-left">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{s.project}</p>
                  <p className="text-xs text-gray-400">{s.approach} · Risk: {s.risk} · {s.sections} sections · {s.date}</p>
                </div>
                {expandedSaved === s.id ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
              </button>
              {expandedSaved === s.id && (
                <div className="px-5 pb-4 bg-gray-50">
                  <p className="text-xs text-gray-500 italic">Strategy preview for {s.project} — click Export to download full document.</p>
                  <button onClick={() => toast.success('Exported')} className="mt-2 flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-white transition-colors">
                    <Download className="h-3 w-3" />Export
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
