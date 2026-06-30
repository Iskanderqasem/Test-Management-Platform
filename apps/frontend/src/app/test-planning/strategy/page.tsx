'use client';
import React, { useState } from 'react';
import { Zap, FileText, Download, ChevronRight } from 'lucide-react';
import toast from '@/lib/toast';
export default function TestStrategyPage() {
  const [form, setForm] = useState({ project:'', scope:'', riskLevel:'medium', approach:'risk-based' });
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = (k:string,v:string) => setForm(p=>({...p,[k]:v}));
  const generate = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setGenerated(true); setLoading(false); toast.success('Test strategy generated!'); }, 1800); };
  return (
    <div className="max-w-4xl space-y-6">
      <div><h1 className="text-xl font-bold text-gray-900">Test Strategy</h1><p className="text-sm text-gray-400">AI-powered test strategy generation</p></div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-1 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap className="h-4 w-4 text-purple-600" />Generate Strategy</h2>
          <form onSubmit={generate} className="space-y-4">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Project Name</label><input required value={form.project} onChange={e=>set('project',e.target.value)} placeholder="e.g. Payment Gateway" className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Scope & Objectives</label><textarea value={form.scope} onChange={e=>set('scope',e.target.value)} rows={3} placeholder="Describe what needs to be tested…" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Risk Level</label>
              <select value={form.riskLevel} onChange={e=>set('riskLevel',e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white appearance-none">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Test Approach</label>
              <select value={form.approach} onChange={e=>set('approach',e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white appearance-none">
                <option value="risk-based">Risk-Based</option><option value="requirement-based">Requirement-Based</option><option value="exploratory">Exploratory</option><option value="agile">Agile Sprint</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full h-9 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</> : <><Zap className="h-3.5 w-3.5" />Generate with AI</>}
            </button>
          </form>
        </div>
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          {generated ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-gray-900">Generated Strategy: {form.project}</h2><button onClick={() => toast.success('Downloaded')} className="flex items-center gap-1.5 h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"><Download className="h-3 w-3" />Export</button></div>
              {[{title:'1. Scope & Objectives',content:'This test strategy covers functional, integration, and performance testing for the '+form.project+'. Objective is to ensure 95% requirement coverage with zero critical defects at release.'},
                {title:'2. Risk Assessment',content:'High-risk areas include payment processing, authentication flows, and data integrity. Mitigation: dedicated test cycles with automated regression suite.'},
                {title:'3. Test Levels',content:'Unit Testing (dev team), Integration Testing (QA), System Testing (QA), UAT (stakeholders), Performance Testing (QA + DevOps).'},
                {title:'4. Automation Strategy',content:'Target 70% automation coverage. Priority: smoke tests, regression suite, API contracts. Tools: Playwright (UI), Jest (unit), k6 (performance).'},
                {title:'5. Entry & Exit Criteria',content:'Entry: requirements approved, dev complete, environment ready. Exit: 95% pass rate, zero critical defects, all high-priority defects resolved.'},
              ].map(s => (
                <div key={s.title} className="border-l-2 border-[#1e3a5f] pl-4"><p className="text-sm font-bold text-gray-900">{s.title}</p><p className="text-sm text-gray-600 mt-1 leading-relaxed">{s.content}</p></div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="h-16 w-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4"><FileText className="h-8 w-8 text-gray-300" /></div>
              <p className="text-sm font-semibold text-gray-500">Fill in the form and click Generate</p>
              <p className="text-xs text-gray-400 mt-1">AI will create a comprehensive test strategy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
