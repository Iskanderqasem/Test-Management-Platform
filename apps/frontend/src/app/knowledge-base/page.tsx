'use client';

import { useState } from 'react';
import { Search, FileText, Book, Sparkles, Upload, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const DOCUMENTS = [
  { id: 1, title: 'IMS Architecture Reference Guide', type: 'Architecture', source: 'Confluence', updated: '2026-06-01', tags: ['IMS', 'VoLTE', '5G'] },
  { id: 2, title: 'Test Plan — Billing System v2 (Historical)', type: 'Test Plan', source: 'SharePoint', updated: '2025-12-15', tags: ['Billing', 'UAT'] },
  { id: 3, title: 'VoLTE Troubleshooting Guide', type: 'Runbook', source: 'Wiki', updated: '2026-03-10', tags: ['VoLTE', 'Troubleshooting'] },
  { id: 4, title: 'HSS Failover Lessons Learned', type: 'Lessons Learned', source: 'PDF', updated: '2026-01-20', tags: ['HSS', 'Failover'] },
  { id: 5, title: 'API Testing Best Practices', type: 'Training', source: 'Internal', updated: '2026-04-05', tags: ['API', 'Testing'] },
  { id: 6, title: 'Network Provisioning SOP', type: 'SOP', source: 'SharePoint', updated: '2026-05-18', tags: ['Provisioning', 'Network'] },
];

const SAMPLE_ANSWER = `Based on the IMS Architecture Reference Guide and previous test plans in the knowledge base:

**VoLTE Call Setup Failure — Common Root Causes:**

1. **IMS Registration Not Completed** — The UE must complete P-CSCF discovery and SIP REGISTER before attempting a call. Check S-CSCF assignment in HSS.

2. **Cx Interface Issue** — MAR/MAA exchange between S-CSCF and HSS must succeed. Common failure: HSS returns "User-Unknown" when IMPI not properly provisioned.

3. **Policy Authorization Failure** — AF must authorize the media via Rx interface to PCRF/PCF. Verify QoS policy rules are pre-configured for VoLTE bearers.

4. **Codec Mismatch** — Originating and terminating sides must agree on AMR-WB codec in SDP offer/answer. Check media gateway configuration.

**Recommended Test Cases to Add:**
- TC: P-CSCF discovery failure via ePDG
- TC: S-CSCF re-assignment after HSS failover
- TC: VoLTE call with PCRF policy denied

**Reference:** IMS Architecture Guide, Section 4.3 · Previous Defect DEF-2024-0087`;

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const askAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setAnswer(SAMPLE_ANSWER);
    setLoading(false);
  };

  const filtered = DOCUMENTS.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) || d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">AI-powered search across all testing knowledge and documents</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium cursor-pointer">
          <Upload className="w-4 h-4" /> Add Document
          <input type="file" className="hidden" onChange={() => toast.success('Document indexed')} />
        </label>
      </div>

      {/* AI Q&A */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-blue-800 rounded-xl p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <p className="font-semibold">Ask AI about your knowledge base</p>
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
            placeholder="e.g. What are common causes of VoLTE call setup failures?"
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button onClick={askAI} disabled={loading} className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Searching…' : 'Ask AI'}
          </button>
        </div>
      </div>

      {answer && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <p className="font-semibold text-gray-800">AI Answer</p>
            <span className="text-xs text-gray-400 ml-auto">Sourced from {DOCUMENTS.length} documents</span>
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{answer}</pre>
        </div>
      )}

      {/* Document Browser */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">Document Library ({DOCUMENTS.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents…" className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg shrink-0"><FileText className="w-4 h-4 text-blue-700" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 line-clamp-2">{doc.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{doc.source} · {doc.updated}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 2).map((t) => <span key={t} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>)}
                </div>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{doc.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
