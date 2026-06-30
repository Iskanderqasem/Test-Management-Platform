'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';
import toast from '@/lib/toast';
export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:'', description:'', type:'web', priority:'medium', startDate:'', endDate:'' });
  const [loading, setLoading] = useState(false);
  const set = (k: string, v: string) => setForm(p => ({...p, [k]: v}));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { toast.success('Project created successfully'); router.push('/projects'); }, 1000);
  };
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/projects" className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"><ArrowLeft className="h-4 w-4 text-gray-500" /></Link>
        <div><h1 className="text-xl font-bold text-gray-900">Create Project</h1><p className="text-sm text-gray-400">Set up a new test management project</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Project Name *</label><input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Payment Gateway v3.2" className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label><textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="Describe the scope and objectives…" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Project Type</label>
              <select value={form.type} onChange={e=>set('type',e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] appearance-none bg-white">
                <option value="web">Web Application</option><option value="mobile">Mobile App</option><option value="api">API / Backend</option><option value="desktop">Desktop App</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e=>set('priority',e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] appearance-none bg-white">
                <option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label><input type="date" value={form.startDate} onChange={e=>set('startDate',e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Target End Date</label><input type="date" value={form.endDate} onChange={e=>set('endDate',e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" /></div>
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
