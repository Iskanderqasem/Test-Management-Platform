'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, Link2, Plus, Sparkles, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const SAMPLE_REQS = [
  { id: 'REQ-001', title: 'User Authentication', type: 'Functional', priority: 'High', source: 'BRD v1.2', status: 'Analyzed', coverage: 94 },
  { id: 'REQ-002', title: 'Session Management', type: 'Security', priority: 'Critical', source: 'Security Spec', status: 'Analyzed', coverage: 87 },
  { id: 'REQ-003', title: 'Real-time Billing Update', type: 'Functional', priority: 'High', source: 'BRD v1.2', status: 'Pending', coverage: 0 },
  { id: 'REQ-004', title: 'API Rate Limiting', type: 'Performance', priority: 'Medium', source: 'API Spec v2', status: 'Analyzed', coverage: 72 },
  { id: 'REQ-005', title: 'VoLTE Call Quality', type: 'Functional', priority: 'High', source: 'Technical Spec', status: 'In Progress', coverage: 45 },
  { id: 'REQ-006', title: 'GDPR Data Compliance', type: 'Compliance', priority: 'Critical', source: 'Legal Requirements', status: 'Analyzed', coverage: 91 },
];

const statusIcon: Record<string, any> = {
  Analyzed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  Pending: <Clock className="w-4 h-4 text-gray-400" />,
  'In Progress': <AlertCircle className="w-4 h-4 text-blue-500" />,
};

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const typeColor: Record<string, string> = {
  Functional: 'bg-blue-100 text-blue-700',
  Security: 'bg-purple-100 text-purple-700',
  Performance: 'bg-cyan-100 text-cyan-700',
  Compliance: 'bg-rose-100 text-rose-700',
};

export default function RequirementsPage() {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [urlInput, setUrlInput] = useState('');

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
    toast.success(`${dropped.length} file(s) added`);
  }, []);

  const handleAnalyze = () => {
    toast.success('AI analysis started — results will appear in minutes');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requirements</h1>
          <p className="text-gray-500 mt-1">Import, analyze, and manage project requirements</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Add Manual
          </button>
          <button onClick={handleAnalyze} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium">
            <Sparkles className="w-4 h-4" /> AI Gap Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Upload Zone */}
        <div className="col-span-1 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 bg-white'}`}
          >
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700">Drop files here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, PPT, Images, PCAP</p>
            <label className="mt-3 inline-block px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs cursor-pointer hover:bg-[#16304f]">
              Browse Files
              <input type="file" multiple className="hidden" onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])} />
            </label>
          </div>

          {/* URL Input */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Link2 className="w-4 h-4" /> Import from URL</p>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Confluence page, SharePoint, URL…"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
            <button className="mt-2 w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium">Import</button>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-2">
              <p className="text-sm font-medium text-gray-700">Queued Files ({files.length})</p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                  <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{f.name}</span>
                  <span className="ml-auto text-gray-400">{(f.size / 1024).toFixed(0)}KB</span>
                </div>
              ))}
              <button onClick={handleAnalyze} className="w-full mt-2 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Analyze with AI
              </button>
            </div>
          )}

          {/* Source Types */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Supported Sources</p>
            <div className="flex flex-wrap gap-1.5">
              {['BRD', 'HLD', 'LLD', 'User Stories', 'PBIs', 'API Docs', 'RFP', 'Acceptance Criteria', 'Architecture Diagrams', 'Email Attachments', 'PDF', 'Word', 'Excel', 'PPT', 'Images'].map((s) => (
                <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <p className="font-semibold text-gray-800">Requirements ({SAMPLE_REQS.length})</p>
            <div className="flex gap-2">
              <button className="text-xs text-blue-700 hover:underline flex items-center gap-1">View RTM <ChevronRight className="w-3 h-3" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Title', 'Type', 'Priority', 'Source', 'Status', 'Coverage'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SAMPLE_REQS.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 text-xs font-mono text-blue-700">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.title}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[r.type] ?? 'bg-gray-100 text-gray-600'}`}>{r.type}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[r.priority]}`}>{r.priority}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.source}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1.5">{statusIcon[r.status]}<span className="text-xs">{r.status}</span></span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${r.coverage >= 80 ? 'bg-green-500' : r.coverage >= 50 ? 'bg-yellow-500' : r.coverage > 0 ? 'bg-orange-500' : 'bg-gray-300'}`} style={{ width: `${r.coverage}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{r.coverage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
