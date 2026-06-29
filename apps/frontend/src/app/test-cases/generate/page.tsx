'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Check, Plus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TEST_TYPES = ['Positive', 'Negative', 'Boundary', 'Exploratory', 'Regression', 'Integration', 'Performance', 'Security', 'Smoke', 'UAT', 'Sanity', 'Accessibility'];

const SAMPLE_GENERATED = [
  { id: 'GEN-001', title: 'Verify VoLTE call setup with valid MSISDN and IMS registration', priority: 'High', type: 'Positive', steps: ['Register SIM on IMS', 'Dial valid MSISDN', 'Verify call setup <3s', 'Verify HD voice codec'], expected: 'Call established in under 3 seconds with AMR-WB codec' },
  { id: 'GEN-002', title: 'Verify call failure when IMS registration is absent', priority: 'Critical', type: 'Negative', steps: ['De-register from IMS', 'Attempt VoLTE call', 'Verify error code returned'], expected: '486 Busy Here or 503 Service Unavailable returned to originating UE' },
  { id: 'GEN-003', title: 'Boundary: minimum MSISDN length validation', priority: 'Medium', type: 'Boundary', steps: ['Attempt call with 6-digit number', 'Attempt call with 7-digit number', 'Attempt with full E.164 number'], expected: 'Only E.164 compliant MSISDNs accepted; shorter numbers return 400 Bad Request' },
  { id: 'GEN-004', title: 'VoLTE call quality MOS score under load (500 concurrent calls)', priority: 'High', type: 'Performance', steps: ['Generate 500 concurrent VoLTE calls', 'Measure MOS score per call', 'Collect PCap for analysis'], expected: 'MOS score >= 3.5 for >= 95% of calls under load' },
  { id: 'GEN-005', title: 'VoWiFi fallback when LTE signal degrades', priority: 'High', type: 'Integration', steps: ['Establish VoLTE call', 'Simulate LTE RSRP < -120 dBm', 'Verify seamless handover to VoWiFi'], expected: 'Call maintained with < 300ms interruption during VoWiFi handover' },
];

export default function GenerateTestCasesPage() {
  const [source, setSource] = useState('requirement');
  const [input, setInput] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Positive', 'Negative', 'Boundary']);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<typeof SAMPLE_GENERATED>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleType = (t: string) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const toggleSelect = (id: string) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleGenerate = async () => {
    if (!input.trim()) return toast.error('Please provide requirements or description');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerated(SAMPLE_GENERATED);
    setLoading(false);
    toast.success(`${SAMPLE_GENERATED.length} test cases generated`);
  };

  const handleImport = () => {
    toast.success(`${selected.length || generated.length} test cases imported to library`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Test Case Generator</h1>
        <p className="text-gray-500 mt-1">Generate comprehensive test cases from requirements, CRs, user stories, or API specs</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Config Panel */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800">Source & Configuration</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['requirement', 'user_story', 'api_spec', 'cr', 'pbi', 'use_case'].map((s) => (
                  <label key={s} className={`flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer text-xs font-medium transition-colors ${source === s ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <input type="radio" name="source" value={s} checked={source === s} onChange={() => setSource(s)} className="hidden" />
                    {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={6}
                placeholder="Paste your requirement text, user story, API spec, or CR description here…&#10;&#10;Example: As a network engineer, I want to provision a new SIM card so that the customer can make and receive calls. The system must validate MSISDN format, check HLR availability, and activate within 30 seconds."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Types to Generate</label>
              <div className="flex flex-wrap gap-2">
                {TEST_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleType(t)}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${selectedTypes.includes(t) ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
                  <option>SIT</option><option>UAT</option><option>PROD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
                  <option>Auto-assign</option><option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating…' : 'Generate Test Cases'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-3 space-y-4">
          {generated.length === 0 && !loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
              <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Generated test cases will appear here</p>
              <p className="text-gray-400 text-sm mt-1">Enter your requirements and click Generate</p>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center">
              <Loader2 className="w-10 h-10 mx-auto text-blue-900 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">AI is analyzing your requirements…</p>
              <p className="text-gray-400 text-sm mt-1">Generating comprehensive test scenarios</p>
            </div>
          )}

          {generated.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">{generated.length} Test Cases Generated</p>
                <div className="flex gap-2">
                  <button onClick={() => setSelected(generated.map((g) => g.id))} className="text-xs text-blue-700 hover:underline">Select All</button>
                  <button onClick={handleImport} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium">
                    <Plus className="w-3.5 h-3.5" /> Import {selected.length > 0 ? `(${selected.length})` : 'All'}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {generated.map((tc) => (
                  <div
                    key={tc.id}
                    onClick={() => toggleSelect(tc.id)}
                    className={`bg-white rounded-xl border p-4 shadow-sm cursor-pointer transition-all ${selected.includes(tc.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${selected.includes(tc.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selected.includes(tc.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-blue-700">{tc.id}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tc.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${tc.priority === 'Critical' ? 'bg-red-100 text-red-700' : tc.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{tc.priority}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2">{tc.title}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p><span className="font-medium text-gray-600">Steps:</span> {tc.steps.join(' → ')}</p>
                          <p><span className="font-medium text-gray-600">Expected:</span> {tc.expected}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
