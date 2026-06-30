'use client';
import React, { useState } from 'react';
import { Zap, Copy, Download, Plus, Trash2 } from 'lucide-react';
import toast from '@/lib/toast';
type TC = { id:string; title:string; steps:string; expected:string; priority:string };
export default function GenerateTestCasesPage() {
  const [form, setForm] = useState({ module:'', requirement:'', count:'10', type:'functional' });
  const [cases, setCases] = useState<TC[]>([]);
  const [loading, setLoading] = useState(false);
  const set = (k:string,v:string) => setForm(p=>({...p,[k]:v}));
  const generate = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => {
      const n = parseInt(form.count)||5;
      const generated: TC[] = Array.from({length:n},(_,i) => ({
        id: `TC-${String(i+1).padStart(3,'0')}`,
        title: `${form.type==='functional'?'Verify':'Test'} ${form.module} — scenario ${i+1}`,
        steps: `1. Navigate to ${form.module}\n2. Enter valid test data\n3. Submit the form\n4. Verify system response`,
        expected: `System should process the request successfully and display confirmation message`,
        priority: i===0?'Critical':i<3?'High':i<6?'Medium':'Low'
      }));
      setCases(generated); setLoading(false); toast.success(`Generated ${n} test cases!`);
    }, 1800);
  };
  const priorityColor: Record<string,string> = {Critical:'bg-red-100 text-red-700',High:'bg-orange-100 text-orange-700',Medium:'bg-yellow-100 text-yellow-700',Low:'bg-gray-100 text-gray-600'};
  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-bold text-gray-900">Generate Test Cases</h1><p className="text-sm text-gray-400">AI-powered test case generation from requirements</p></div></div>
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Zap className="h-4 w-4 text-purple-600" />Configure</h2>
          <form onSubmit={generate} className="space-y-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Module / Feature *</label><input required value={form.module} onChange={e=>set('module',e.target.value)} placeholder="e.g. User Login" className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Requirement / Context</label><textarea value={form.requirement} onChange={e=>set('requirement',e.target.value)} rows={3} placeholder="Paste requirement text…" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none" /></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Test Type</label>
              <select value={form.type} onChange={e=>set('type',e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                <option value="functional">Functional</option><option value="negative">Negative</option><option value="boundary">Boundary Value</option><option value="regression">Regression</option>
              </select>
            </div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Number of Cases</label>
              <select value={form.count} onChange={e=>set('count',e.target.value)} className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                <option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20">20</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full h-9 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</> : <><Zap className="h-3.5 w-3.5" />Generate</>}
            </button>
          </form>
        </div>
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {cases.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900">{cases.length} Test Cases Generated</p>
                <div className="flex gap-2">
                  <button onClick={() => toast.success('Copied!')} className="flex items-center gap-1 h-7 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"><Copy className="h-3 w-3" />Copy All</button>
                  <button onClick={() => toast.success('Saved to library!')} className="flex items-center gap-1 h-7 px-3 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#162b47]"><Plus className="h-3 w-3" />Save All</button>
                </div>
              </div>
              <div className="overflow-y-auto max-h-[500px] divide-y divide-gray-50">
                {cases.map((c,i) => (
                  <div key={c.id} className="px-5 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2"><span className="text-xs font-mono font-bold text-[#1e3a5f]">{c.id}</span><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityColor[c.priority]}`}>{c.priority}</span></div>
                      <button onClick={() => setCases(p=>p.filter((_,j)=>j!==i))} className="text-gray-300 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 mb-2">{c.title}</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div><p className="font-medium text-gray-500 mb-1">Steps</p><p className="text-gray-600 whitespace-pre-line leading-relaxed">{c.steps}</p></div>
                      <div><p className="font-medium text-gray-500 mb-1">Expected Result</p><p className="text-gray-600">{c.expected}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-4"><Zap className="h-8 w-8 text-purple-300" /></div>
              <p className="text-sm font-semibold text-gray-500">No test cases yet</p>
              <p className="text-xs text-gray-400 mt-1">Fill in the form and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
