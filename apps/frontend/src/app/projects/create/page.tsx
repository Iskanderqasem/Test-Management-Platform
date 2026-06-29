'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Check, FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';

const STEPS = ['Project Info', 'Team & Owners', 'Environments', 'Integrations', 'Review'];

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', description: '', type: 'telecom', phase: 'Planning',
    startDate: '', endDate: '', owner: '', team: '',
    businessOwner: '', technicalOwner: '', stakeholders: '',
    environments: ['DEV', 'SIT', 'UAT', 'PROD'],
    adoEnabled: false, jiraEnabled: false, confluenceEnabled: false,
    adoOrg: '', adoProject: '', jiraUrl: '', jiraProject: '',
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    toast.success('Project created successfully!');
    router.push('/projects');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-500 mt-1">Set up a new test management project</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        {step === 0 && (
          <>
            <h2 className="font-semibold text-gray-800">Project Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. 5G Core Upgrade" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Brief project description…" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
                  <option value="telecom">Telecom</option>
                  <option value="fintech">FinTech</option>
                  <option value="enterprise">Enterprise IT</option>
                  <option value="ecommerce">E-Commerce</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Phase</label>
                <select value={form.phase} onChange={(e) => set('phase', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
                  {['Planning', 'Requirements', 'Test Design', 'Execution', 'UAT', 'PVT', 'Closed'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="font-semibold text-gray-800">Team & Ownership</h2>
            <div className="space-y-4">
              {[
                { label: 'Test Manager / Lead', key: 'owner', placeholder: 'e.g. Sarah Chen' },
                { label: 'Business Owner', key: 'businessOwner', placeholder: 'e.g. VP of Products' },
                { label: 'Technical Owner', key: 'technicalOwner', placeholder: 'e.g. Lead Architect' },
                { label: 'Stakeholders (comma separated)', key: 'stakeholders', placeholder: 'e.g. PM, BA, Dev Lead' },
                { label: 'Team Members (comma separated emails)', key: 'team', placeholder: 'john@co.com, jane@co.com' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold text-gray-800">Environments</h2>
            <p className="text-sm text-gray-500">Select which test environments this project will use</p>
            <div className="grid grid-cols-3 gap-3">
              {['DEV', 'SIT', 'UAT', 'PROD', 'Pre-PROD', 'NFT', 'DR'].map((env) => (
                <label key={env} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 transition-colors">
                  <input type="checkbox" defaultChecked={form.environments.includes(env)} className="accent-blue-900" />
                  <span className="text-sm font-medium">{env}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold text-gray-800">Integrations</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.adoEnabled} onChange={(e) => set('adoEnabled', e.target.checked)} className="accent-blue-900 w-4 h-4" />
                  <div>
                    <p className="font-medium text-sm">Azure DevOps</p>
                    <p className="text-xs text-gray-500">Sync defects, test cases, and work items</p>
                  </div>
                </label>
                {form.adoEnabled && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <input value={form.adoOrg} onChange={(e) => set('adoOrg', e.target.value)} placeholder="ADO Organization" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
                    <input value={form.adoProject} onChange={(e) => set('adoProject', e.target.value)} placeholder="ADO Project" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
                  </div>
                )}
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.jiraEnabled} onChange={(e) => set('jiraEnabled', e.target.checked)} className="accent-blue-900 w-4 h-4" />
                  <div>
                    <p className="font-medium text-sm">Jira</p>
                    <p className="text-xs text-gray-500">Sync defects and test execution results</p>
                  </div>
                </label>
                {form.jiraEnabled && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <input value={form.jiraUrl} onChange={(e) => set('jiraUrl', e.target.value)} placeholder="Jira URL" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
                    <input value={form.jiraProject} onChange={(e) => set('jiraProject', e.target.value)} placeholder="Project Key" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900" />
                  </div>
                )}
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.confluenceEnabled} onChange={(e) => set('confluenceEnabled', e.target.checked)} className="accent-blue-900 w-4 h-4" />
                  <div>
                    <p className="font-medium text-sm">Confluence</p>
                    <p className="text-xs text-gray-500">Import requirements and publish reports</p>
                  </div>
                </label>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-semibold text-gray-800">Review & Create</h2>
            <div className="space-y-2">
              {[
                ['Name', form.name || '—'],
                ['Description', form.description || '—'],
                ['Type', form.type],
                ['Phase', form.phase],
                ['Start Date', form.startDate || '—'],
                ['End Date', form.endDate || '—'],
                ['Owner', form.owner || '—'],
                ['Business Owner', form.businessOwner || '—'],
                ['Integrations', [form.adoEnabled && 'ADO', form.jiraEnabled && 'Jira', form.confluenceEnabled && 'Confluence'].filter(Boolean).join(', ') || 'None'],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2 text-sm py-2 border-b border-gray-100">
                  <span className="w-36 text-gray-500 font-medium shrink-0">{k}</span>
                  <span className="text-gray-800">{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => step > 0 ? setStep(step - 1) : router.back()} className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ChevronLeft className="w-4 h-4" /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
            <FolderKanban className="w-4 h-4" /> Create Project
          </button>
        )}
      </div>
    </div>
  );
}
