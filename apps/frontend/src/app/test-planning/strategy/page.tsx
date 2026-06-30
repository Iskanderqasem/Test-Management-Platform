'use client';
import React, { useState } from 'react';
import { Zap, FileText, Download, Layout, ChevronDown, ChevronRight, Save, Link2, Plus } from 'lucide-react';
import toast from '@/lib/toast';

const TEMPLATE_DEFAULTS = {
  project: '',
  scope: 'End-to-end functional, integration, and performance testing covering all user-facing features and API endpoints as defined in the approved FRS.',
  riskLevel: 'high',
  approach: 'risk-based',
  jiraUrl: '',
  adoUrl: '',
};

type FormState = typeof TEMPLATE_DEFAULTS;

type SavedStrategy = {
  id: string;
  project: string;
  approach: string;
  risk: string;
  date: string;
  jiraUrl: string;
  adoUrl: string;
  sections: StrategySection[];
};

type StrategySection = { title: string; content: string };

function buildStrategy(form: FormState): StrategySection[] {
  const integrations = [];
  if (form.jiraUrl) integrations.push(`Jira: ${form.jiraUrl}`);
  if (form.adoUrl) integrations.push(`Azure DevOps: ${form.adoUrl}`);
  const integrationNote = integrations.length
    ? `\nIntegrations: ${integrations.join(' | ')}`
    : '';

  return [
    {
      title: '1. Scope & Objectives',
      content: `This strategy covers all testing activities for ${form.project}. ${form.scope}\n\nObjective: achieve 95%+ requirement coverage with zero critical defects at release.${integrationNote}`,
    },
    {
      title: '2. Risk Assessment',
      content: `Risk Level: ${form.riskLevel.toUpperCase()}.\n\nHigh-risk areas: authentication, data integrity, payment flows, third-party integrations.\n\nMitigation: dedicated test cycles, automated regression, exploratory sessions on high-risk modules. Risk register maintained in TestOS and tracked${form.jiraUrl ? ` in Jira (${form.jiraUrl})` : form.adoUrl ? ` in Azure DevOps (${form.adoUrl})` : ' by the Test Manager'}.`,
    },
    {
      title: '3. Test Levels — Unit Testing',
      content: 'Owner: Development team.\nCoverage target: 80% code coverage minimum.\nTools: Jest / Vitest.\nExecution: triggered on every pull request via CI pipeline.\nReporting: code coverage badge in repository.',
    },
    {
      title: '4. Test Levels — Integration Testing',
      content: 'Owner: QA team.\nFocus: API contract testing and service-to-service integration.\nTools: Postman / Newman, Pact for consumer-driven contract testing.\nExecution: nightly automated runs.\nDefects logged in ' + (form.jiraUrl ? `Jira (${form.jiraUrl})` : form.adoUrl ? `Azure DevOps (${form.adoUrl})` : 'TestOS defect tracker') + '.',
    },
    {
      title: '5. Test Levels — System Testing',
      content: `Owner: QA team.\nFocus: End-to-end functional testing across all ${form.project} modules.\nCovers: happy paths, negative scenarios, boundary conditions, error handling.\nTools: Playwright (UI), REST Assured (API).\nEnvironment: dedicated QA environment.`,
    },
    {
      title: '6. Test Levels — User Acceptance Testing (UAT)',
      content: 'Owner: Business stakeholders + Product Owner.\nAcceptance criteria: derived from approved user stories.\nFacilitated by: Test Manager.\nTracking: ' + (form.jiraUrl ? `Jira (${form.jiraUrl})` : form.adoUrl ? `Azure DevOps (${form.adoUrl})` : 'TestOS') + '.\nSign-off: required from Product Owner and key stakeholders before release.',
    },
    {
      title: '7. Test Levels — Performance Testing',
      content: 'Owner: QA + DevOps.\nLoad test: 1,000 concurrent users for 30 minutes.\nStress test: 150% of expected peak load.\nSpike test: sudden traffic burst simulation.\nEndurance test: 8-hour sustained load.\nTools: k6.\nTarget SLA: p95 response time < 500ms, error rate < 0.1%.',
    },
    {
      title: '8. Test Types',
      content: '• Functional Testing\n• Regression Testing\n• Smoke & Sanity Testing\n• Exploratory Testing\n• Security Testing (OWASP Top 10)\n• Accessibility Testing (WCAG 2.1 AA)\n• Compatibility Testing (browsers + mobile devices)\n• Data Migration Testing (if applicable)',
    },
    {
      title: '9. Automation Strategy',
      content: 'Target automation coverage: 70%.\nPriority order: Smoke suite (daily) → Regression suite (each release) → API contracts (every merge).\nFramework: Playwright + TypeScript.\nCI/CD: GitHub Actions / Azure Pipelines.\nTest results: published to TestOS dashboard' + (form.adoUrl ? ` and Azure DevOps (${form.adoUrl})` : '') + '.',
    },
    {
      title: '10. Resource Plan',
      content: '• 1 × Test Manager — strategy, planning, stakeholder communication\n• 1 × Senior QA Engineer — automation framework, test architecture\n• 2–3 × QA Engineers — test case authoring, manual execution\n• Dev team — unit test coverage\n\nEstimated effort: 120 person-days.\nTools: TestOS' + (form.jiraUrl ? `, Jira (${form.jiraUrl})` : '') + (form.adoUrl ? `, Azure DevOps (${form.adoUrl})` : '') + ', BrowserStack, k6.',
    },
    {
      title: '11. Entry & Exit Criteria',
      content: 'ENTRY CRITERIA:\n• All requirements reviewed and approved\n• Development complete for the sprint/release scope\n• Test environment provisioned and stable\n• Smoke test suite passing (> 90%)\n• Test data prepared and seeded\n\nEXIT CRITERIA:\n• 95%+ test cases executed\n• Zero open Severity-1 (Critical) defects\n• All Severity-2 (High) defects resolved or risk-accepted\n• Test summary report signed off by stakeholders',
    },
    {
      title: '12. Defect Management',
      content: 'Defect tracking tool: ' + (form.jiraUrl ? `Jira — ${form.jiraUrl}` : form.adoUrl ? `Azure DevOps — ${form.adoUrl}` : 'TestOS Defect Tracker') + '.\n\nSeverity SLA:\n• Critical (P1): must be fixed within 4 hours\n• High (P2): must be fixed within 1 business day\n• Medium (P3): must be fixed within 3 business days\n• Low (P4): fix in next sprint\n\nProcess: Defect found → logged → triaged → assigned → fixed → retested → closed.\nDefect review: daily standup + weekly defect triage meeting.',
    },
    {
      title: '13. Reporting & Metrics',
      content: 'Daily: test execution dashboard in TestOS (pass rate, open defects, blocker count).\nWeekly: status email to stakeholders — test progress, defect trends, risk updates.\nSprint-end: test summary report — coverage achieved, defects found/resolved, automation ROI.\nFinal: release readiness report — go/no-go recommendation.\n\nKey metrics: test case pass rate, defect density, automation coverage %, requirement traceability %.' + (form.jiraUrl ? `\n\nJira project board: ${form.jiraUrl}` : '') + (form.adoUrl ? `\nAzure DevOps board: ${form.adoUrl}` : ''),
    },
  ];
}

export default function TestStrategyPage() {
  const [form, setForm] = useState<FormState>({ project: '', scope: '', riskLevel: 'medium', approach: 'risk-based', jiraUrl: '', adoUrl: '' });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [expandedSaved, setExpandedSaved] = useState<string | null>(null);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const applyTemplate = () => {
    setForm(p => ({ ...p, ...TEMPLATE_DEFAULTS, project: p.project, jiraUrl: p.jiraUrl, adoUrl: p.adoUrl }));
    toast.success('Template loaded');
  };

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.project.trim()) { toast.error('Please enter a project name'); return; }
    setLoading(true);
    setTimeout(() => { setGenerated(true); setLoading(false); toast.success('Strategy generated — review and save when ready'); }, 1800);
  };

  const saveStrategy = () => {
    if (!generated) return;
    const id = Date.now().toString();
    setSavedStrategies(p => [{
      id,
      project: form.project,
      approach: form.approach,
      risk: form.riskLevel,
      date: new Date().toISOString().split('T')[0],
      jiraUrl: form.jiraUrl,
      adoUrl: form.adoUrl,
      sections: buildStrategy(form),
    }, ...p]);
    toast.success(`Strategy for "${form.project}" saved`);
  };

  const strategy = buildStrategy(form);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Test Strategy</h1>
        <p className="text-sm text-gray-400">AI-powered 13-section enterprise test strategy</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Form */}
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Zap className="h-4 w-4 text-purple-600" />Configure</h2>
          <button onClick={applyTemplate} className="w-full flex items-center justify-center gap-2 h-8 rounded-lg border border-dashed border-gray-300 text-xs text-gray-600 hover:bg-gray-50 hover:border-[#1e3a5f] transition-colors">
            <Layout className="h-3.5 w-3.5" /> Load Template
          </button>
          <form onSubmit={generate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project Name *</label>
              <input required value={form.project} onChange={e => set('project', e.target.value)} placeholder="e.g. Payment Gateway v3"
                className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Scope & Objectives</label>
              <textarea value={form.scope} onChange={e => set('scope', e.target.value)} rows={3} placeholder="Describe what needs to be tested…"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Risk Level</label>
              <select value={form.riskLevel} onChange={e => set('riskLevel', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Test Approach</label>
              <select value={form.approach} onChange={e => set('approach', e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                <option value="risk-based">Risk-Based</option><option value="requirement-based">Requirement-Based</option><option value="exploratory">Exploratory</option><option value="agile">Agile Sprint</option>
              </select>
            </div>

            {/* Integrations */}
            <div className="pt-1 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Link2 className="h-3 w-3" />Integrations (optional)</p>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Jira Project URL</label>
                  <input value={form.jiraUrl} onChange={e => set('jiraUrl', e.target.value)} placeholder="https://yourorg.atlassian.net/…"
                    className="w-full h-8 px-3 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Azure DevOps (ADO) URL</label>
                  <input value={form.adoUrl} onChange={e => set('adoUrl', e.target.value)} placeholder="https://dev.azure.com/org/project"
                    className="w-full h-8 px-3 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-9 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading
                ? <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                : <><Zap className="h-3.5 w-3.5" />Generate with AI</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          {generated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">{form.project} — Test Strategy</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{strategy.length} sections · {form.approach} · Risk: {form.riskLevel}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Exported')} className="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                    <Download className="h-3 w-3" />Export
                  </button>
                  <button onClick={saveStrategy} className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700">
                    <Save className="h-3 w-3" />Save Strategy
                  </button>
                </div>
              </div>
              {/* Integration badges */}
              {(form.jiraUrl || form.adoUrl) && (
                <div className="flex gap-2 flex-wrap">
                  {form.jiraUrl && <a href={form.jiraUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-100"><Link2 className="h-3 w-3" />Jira</a>}
                  {form.adoUrl && <a href={form.adoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-700 hover:bg-indigo-100"><Link2 className="h-3 w-3" />Azure DevOps</a>}
                </div>
              )}
              <div className="overflow-y-auto max-h-[600px] space-y-3 pr-1">
                {strategy.map(s => (
                  <div key={s.title} className="border-l-2 border-[#1e3a5f] pl-4 py-1">
                    <p className="text-sm font-bold text-gray-900">{s.title}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{s.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4"><FileText className="h-8 w-8 text-gray-300" /></div>
              <p className="text-sm font-semibold text-gray-500">Fill in the form and click Generate</p>
              <p className="text-xs text-gray-400 mt-1">AI will create a 13-section enterprise test strategy</p>
              <div className="mt-4 grid grid-cols-2 gap-1.5 text-left max-w-xs">
                {['Scope & Objectives','Risk Assessment','Unit / Integration / System / UAT / Performance','Test Types','Automation Strategy','Resource Plan','Entry & Exit Criteria','Defect Management','Reporting & Metrics'].map(s => (
                  <div key={s} className="flex items-start gap-1.5 col-span-2"><span className="text-green-500 text-xs mt-0.5">✓</span><span className="text-xs text-gray-400">{s}</span></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Strategies — only shown when there are actual saved ones */}
      {savedStrategies.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Saved Strategies</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{savedStrategies.length}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {savedStrategies.map(s => (
              <div key={s.id}>
                <button onClick={() => setExpandedSaved(expandedSaved === s.id ? null : s.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{s.project}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-400">{s.approach} · Risk: {s.risk} · {s.sections.length} sections · {s.date}</span>
                      {s.jiraUrl && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">Jira</span>}
                      {s.adoUrl && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium">ADO</span>}
                    </div>
                  </div>
                  {expandedSaved === s.id ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>
                {expandedSaved === s.id && (
                  <div className="px-5 pb-5 bg-gray-50 space-y-3">
                    {(s.jiraUrl || s.adoUrl) && (
                      <div className="flex gap-2 pt-1">
                        {s.jiraUrl && <a href={s.jiraUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-xs font-medium text-blue-700"><Link2 className="h-3 w-3" />Jira</a>}
                        {s.adoUrl && <a href={s.adoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-xs font-medium text-indigo-700"><Link2 className="h-3 w-3" />Azure DevOps</a>}
                      </div>
                    )}
                    {s.sections.map(sec => (
                      <div key={sec.title} className="border-l-2 border-[#1e3a5f] pl-3">
                        <p className="text-xs font-bold text-gray-800">{sec.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line leading-relaxed line-clamp-3">{sec.content}</p>
                      </div>
                    ))}
                    <button onClick={() => toast.success('Exported')} className="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:bg-gray-50">
                      <Download className="h-3 w-3" />Export Full Strategy
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
