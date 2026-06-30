'use client';
import React, { useState } from 'react';
import { ArrowLeft, Save, Zap, FileText, Layout } from 'lucide-react';
import Link from 'next/link';
import toast from '@/lib/toast';

const SECTIONS = [
  'Document Control', 'Version History', 'Approval', 'Distribution', 'Reviewed By',
  'Table of Contents', 'Introduction', 'Objectives', 'Scope', 'Not in Scope',
  'Test Environment', 'Test Data', 'Entry Criteria', 'Exit Criteria', 'Test Deliverables',
  'Resources', 'Roles', 'Responsibilities', 'Schedule', 'Milestones',
  'Risks', 'Dependencies', 'Communication Plan', 'Defect Management', 'Tools', 'Reporting & Approvals',
];

const TEMPLATE: Record<string, string> = {
  'Document Control': 'Document Title: [Project Name] System Test Plan\nDocument ID: TP-001\nCreated By: [Author]\nCreated Date: [Date]\nLast Modified: [Date]',
  'Version History': 'v1.0 | [Date] | Initial draft | [Author]\nv1.1 | [Date] | Updated scope | [Author]',
  'Approval': 'Test Manager: ______________ Date: ______\nProject Manager: __________ Date: ______\nDevelopment Lead: _________ Date: ______',
  'Distribution': 'QA Team, Development Team, Project Manager, Business Analysts, Stakeholders',
  'Reviewed By': '[Reviewer Name] — [Role] — [Date]',
  'Table of Contents': '(Auto-generated from sections above)',
  'Introduction': 'This Test Plan describes the testing approach, scope, resources, and schedule for [Project Name]. It defines the testing strategy to verify that all functional and non-functional requirements are met prior to production release.',
  'Objectives': '1. Verify all functional requirements are implemented correctly.\n2. Validate system performance under expected load.\n3. Ensure no critical or high defects remain at release.\n4. Confirm integration with third-party systems works as expected.',
  'Scope': 'In scope: All features listed in the approved FRS document, API endpoints, UI flows, integration points with payment provider and notification service.',
  'Not in Scope': 'Out of scope: Infrastructure setup, third-party service internals, legacy data migration scripts, UAT sign-off (handled separately).',
  'Test Environment': 'Environment: QA (qa.example.com)\nDatabase: PostgreSQL 15 (QA instance)\nOS: Ubuntu 22.04 LTS\nBrowser: Chrome 124+, Firefox 120+, Edge 124+\nMobile: iOS 17, Android 14',
  'Test Data': 'Test data will be sourced from sanitized production snapshots. Synthetic data generated for edge cases. PII masked in all non-production environments.',
  'Entry Criteria': '1. All development tasks for the sprint marked Done.\n2. Code deployed to QA environment.\n3. Smoke test suite passing.\n4. Test cases reviewed and approved.',
  'Exit Criteria': '1. 95% of test cases executed.\n2. 100% of critical and high priority defects resolved.\n3. No open severity-1 defects.\n4. Test summary report approved by Test Manager.',
  'Test Deliverables': '- Test Plan (this document)\n- Test Cases repository\n- Automated test scripts\n- Test Execution Report\n- Defect Log\n- Test Summary Report',
  'Resources': 'QA Team: 3 QA Engineers, 1 Senior QA, 1 Test Manager\nTools: Jira, TestOS, Playwright, Postman, k6\nEnvironments: DEV, QA, Staging',
  'Roles': 'Test Manager: Overall test strategy and reporting\nSenior QA: Test design and review\nQA Engineers: Test execution and defect logging\nDevelopers: Defect resolution and unit testing',
  'Responsibilities': 'Test Manager: Approve test plan, monitor progress, sign off\nQA Engineers: Write and execute test cases, log defects\nDev Lead: Fix defects within SLA, support environment issues',
  'Schedule': 'Test Planning: Week 1\nTest Case Design: Week 1–2\nEnvironment Setup: Week 2\nTest Execution: Week 3–4\nRegression: Week 4\nSign-off: End of Week 4',
  'Milestones': 'M1: Test Plan approved — Day 3\nM2: Test cases complete — Day 10\nM3: Execution complete — Day 24\nM4: Regression complete — Day 28\nM5: Go/No-Go decision — Day 30',
  'Risks': '1. Environment instability (Likelihood: Medium, Impact: High) — Mitigation: Dedicated QA environment with daily health checks.\n2. Scope creep (Likelihood: High, Impact: Medium) — Mitigation: Change control process.',
  'Dependencies': '1. Dev completion of feature branches by Week 2.\n2. Test data scripts available by Day 5.\n3. Third-party API sandbox credentials by Day 3.\n4. QA environment provisioned by Day 5.',
  'Communication Plan': 'Daily standups at 09:30.\nWeekly test status report every Friday.\nDefect triage every Tuesday and Thursday.\nEscalation path: QA Engineer → Senior QA → Test Manager → PM.',
  'Defect Management': 'Defects logged in Jira with severity (Critical/High/Medium/Low).\nSLA: Critical — 4h, High — 1 day, Medium — 3 days, Low — next release.\nRe-test by original tester. Closure approved by QA lead.',
  'Tools': 'Test Management: TestOS\nDefect Tracking: Jira\nAutomation: Playwright (UI), Jest (unit), k6 (performance)\nAPI Testing: Postman\nCI/CD: GitHub Actions',
  'Reporting & Approvals': 'Daily execution report via TestOS dashboard.\nFinal Test Summary Report submitted 2 days before release.\nApprovals required from: Test Manager, Project Manager, Development Lead.',
};

function generateAI(projectName: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const section of SECTIONS) {
    result[section] = TEMPLATE[section]
      ? TEMPLATE[section].replace(/\[Project Name\]/g, projectName).replace(/\[project\]/gi, projectName)
      : `AI-generated content for "${section}" tailored to ${projectName}.`;
  }
  return result;
}

export default function CreateTestPlanPage() {
  const [projectName, setProjectName] = useState('');
  const [content, setContent] = useState<Record<string, string>>({});
  const [active, setActive] = useState(SECTIONS[0]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const useTemplate = () => {
    setContent(generateAI('Your Project'));
    toast.success('Template loaded');
  };

  const generateWithAI = () => {
    if (!projectName) { toast.error('Enter a project name first'); return; }
    setGenerating(true);
    setTimeout(() => {
      setContent(generateAI(projectName));
      setGenerating(false);
      toast.success('AI content generated for all 26 sections');
    }, 2000);
  };

  const writeManually = () => {
    setContent({});
    toast.success('Ready for manual entry');
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success('Test plan saved'); }, 800);
  };

  const filled = SECTIONS.filter(s => content[s]?.trim()).length;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/test-planning/plans" className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"><ArrowLeft className="h-4 w-4 text-gray-500" /></Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Create Test Plan</h1>
            <p className="text-xs text-gray-400">{filled}/{SECTIONS.length} sections complete</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name…"
            className="h-9 px-3 rounded-lg border border-gray-300 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
          <button onClick={useTemplate} className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Layout className="h-4 w-4" /> Use Template
          </button>
          <button onClick={generateWithAI} disabled={generating} className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-60 transition-colors">
            {generating ? <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</> : <><Zap className="h-4 w-4" />Generate with AI</>}
          </button>
          <button onClick={writeManually} className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText className="h-4 w-4" /> Write Manually
          </button>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] disabled:opacity-60 transition-colors">
            {saving ? <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 shrink-0 border-r border-gray-200 bg-gray-50 overflow-y-auto py-3">
          {SECTIONS.map((section, i) => {
            const done = !!content[section]?.trim();
            return (
              <button key={section} onClick={() => setActive(section)}
                className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 transition-colors ${active === section ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${done ? 'bg-green-500 border-green-500 text-white' : active === section ? 'border-white/50 text-white/70' : 'border-gray-300 text-gray-400'}`}>
                  {done ? '✓' : i + 1}
                </span>
                <span className="truncate">{section}</span>
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-3xl">
            <h2 className="text-base font-bold text-gray-900 mb-1">{active}</h2>
            <p className="text-xs text-gray-400 mb-4">Section {SECTIONS.indexOf(active) + 1} of {SECTIONS.length}</p>
            {active === 'Table of Contents' ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2 italic">Auto-generated from sections:</p>
                <ol className="space-y-1">
                  {SECTIONS.filter(s => s !== 'Table of Contents').map((s, i) => (
                    <li key={s} className="text-sm text-gray-700">{i + 1}. {s}</li>
                  ))}
                </ol>
              </div>
            ) : (
              <textarea
                value={content[active] || ''}
                onChange={e => setContent(prev => ({ ...prev, [active]: e.target.value }))}
                rows={18}
                placeholder={`Enter content for "${active}"…`}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none font-mono"
              />
            )}
            <div className="flex justify-between mt-4">
              <button onClick={() => { const i = SECTIONS.indexOf(active); if (i > 0) setActive(SECTIONS[i - 1]); }}
                disabled={SECTIONS.indexOf(active) === 0}
                className="h-8 px-4 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                ← Previous
              </button>
              <button onClick={() => { const i = SECTIONS.indexOf(active); if (i < SECTIONS.length - 1) setActive(SECTIONS[i + 1]); }}
                disabled={SECTIONS.indexOf(active) === SECTIONS.length - 1}
                className="h-8 px-4 rounded-lg bg-[#1e3a5f] text-white text-xs font-medium hover:bg-[#162b47] disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
