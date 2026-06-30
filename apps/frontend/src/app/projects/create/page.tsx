'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Info, FileText } from 'lucide-react';
import Link from 'next/link';
import toast from '@/lib/toast';

const DOC_TYPES = ['LLD', 'HLD', 'RFP', 'SOW', 'BRD', 'FRS'];

interface UploadedFile { name: string; type: string; size: string; }

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', type: 'web', priority: 'medium', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [autoTestPlan, setAutoTestPlan] = useState(false);
  const [autoStrategy, setAutoStrategy] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map(f => ({
      name: f.name,
      type: DOC_TYPES.find(t => f.name.toUpperCase().includes(t)) || 'Document',
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) added`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Project created successfully');
      if (autoTestPlan) toast.success('Test plan generation queued');
      if (autoStrategy) toast.success('Test strategy generation queued');
      router.push('/projects');
    }, 1000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects" className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Project</h1>
          <p className="text-sm text-gray-400">Set up a new test management project</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Payment Gateway v3.2"
              className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the scope and objectives…"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Project Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] appearance-none bg-white">
                <option value="web">Web Application</option><option value="mobile">Mobile App</option><option value="api">API / Backend</option><option value="desktop">Desktop App</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] appearance-none bg-white">
                <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Target End Date</label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            </div>
          </div>

          {/* Project Documents */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">Project Documents</label>
              <div className="relative">
                <button type="button" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}
                  className="h-4 w-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors">
                  <Info className="h-2.5 w-2.5" />
                </button>
                {showTooltip && (
                  <div className="absolute left-6 top-0 z-10 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                    Uploading these documents enables AI to generate more accurate test artifacts tailored to your project.
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400">— LLD, HLD, RFP, SOW, BRD, FRS</span>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragging ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}>
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Drag & drop files here</p>
              <p className="text-xs text-gray-400 mt-1">or <span className="text-[#1e3a5f] font-medium">browse files</span> · PDF, DOCX, XLSX supported</p>
              <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.xlsx,.xls" className="hidden" onChange={e => addFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 bg-gray-50">
                    <FileText className="h-4 w-4 text-[#1e3a5f] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                      <p className="text-xs text-gray-400">{f.type} · {f.size}</p>
                    </div>
                    <button type="button" onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                      className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors">
                      <X className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auto-generate toggles */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">After Creation</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <button type="button" onClick={() => setAutoTestPlan(p => !p)}
                className={`relative h-5 w-9 rounded-full transition-colors ${autoTestPlan ? 'bg-[#1e3a5f]' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${autoTestPlan ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-gray-700">Auto-generate test plan after creation</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <button type="button" onClick={() => setAutoStrategy(p => !p)}
                className={`relative h-5 w-9 rounded-full transition-colors ${autoStrategy ? 'bg-[#1e3a5f]' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${autoStrategy ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-sm text-gray-700">Auto-generate test strategy after creation</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex items-center gap-2 h-9 px-6 rounded-lg bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#162b47] transition-colors disabled:opacity-60">
              {loading ? <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : 'Create Project'}
            </button>
            <Link href="/projects" className="flex items-center h-9 px-6 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
