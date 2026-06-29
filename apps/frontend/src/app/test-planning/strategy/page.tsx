'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Eye, ChevronDown, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const STRATEGY_SECTIONS = [
  'Document Control & Version History',
  'Introduction & Document Purpose',
  'Project Background & Context',
  'Test Scope — In Scope & Out of Scope',
  'Test Approach & Testing Levels',
  'Testing Types (Functional, Performance, Security, UAT, PVT)',
  'Entry & Exit Criteria',
  'Defect Management Process',
  'Risk Management & Mitigation',
  'Resource Plan & RACI Matrix',
  'Environment Requirements',
  'Test Data Strategy',
  'Automation Strategy',
  'Performance Testing Strategy',
  'Security Testing Strategy',
  'Reporting Strategy & Communication Plan',
  'Deliverables & Schedule',
  'Dependencies, Assumptions & Constraints',
  'Approval & Sign-Off',
];

const SAMPLE_STRATEGY = `# Test Strategy Document
## 5G Core Upgrade Project

**Document Control**
| Field | Detail |
|-------|--------|
| Version | 1.0 |
| Status | Draft |
| Author | AI Test Manager |
| Date | 29 June 2026 |
| Project | 5G Core Upgrade |

---

## 1. Introduction

### 1.1 Document Purpose
This Test Strategy defines the overall testing approach, scope, resources, schedule, and risk management for the 5G Core Upgrade project. It serves as the guiding document for all testing activities from SIT through Production Verification Testing (PVT).

### 1.2 Project Background
The organization is upgrading its 5G core network to support 5G NSA and SA deployments. The upgrade impacts IMS, HSS, PCF, AMF, and SMF components. This project carries HIGH business risk due to its impact on live voice and data services.

---

## 2. Test Scope

### 2.1 In Scope
- IMS Core: CSCF, AS, MGCF components
- HSS: Subscription data migration and Cx/Dx interface
- PCF: Policy control and QoS rule validation
- VoLTE and VoWiFi call flows
- 5G SA data bearer establishment
- Billing integration and charging trigger points
- Roaming interfaces (Sh, Ro, Rf)

### 2.2 Out of Scope
- PCRF (being decommissioned in parallel project)
- Legacy 2G/3G core (separate project stream)
- Customer-facing web portals
- Third-party MVNO integrations (Phase 2)

---

## 3. Test Approach

### 3.1 Testing Levels
| Level | Scope | Owner | Environment |
|-------|-------|-------|-------------|
| Unit Testing | Individual components | Development | DEV |
| Integration Testing | Interface-level | QA Team | SIT |
| System Testing | End-to-end flows | QA Team | SIT |
| Performance Testing | Load and stress | Performance Team | NFT |
| UAT | Business validation | Business Owners | UAT |
| PVT | Production health check | Operations | PROD |

---

## 4. Entry & Exit Criteria

### Entry Criteria — System Test
- All unit tests passing (>95%)
- Test environment stable and baselined
- Test data provisioned and verified
- All High/Critical defects from integration test resolved

### Exit Criteria — System Test
- 100% of test cases executed
- Pass rate ≥ 95%
- Zero open Critical defects
- Zero open High defects older than 5 business days
- Performance benchmarks met`;

export default function TestStrategyPage() {
  const [project, setProject] = useState('5G Core Upgrade');
  const [template, setTemplate] = useState('enterprise');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const generate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setGenerated(SAMPLE_STRATEGY);
    setLoading(false);
    toast.success('Test Strategy generated successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Test Strategy Generator</h1>
        <p className="text-gray-500 mt-1">Generate a complete enterprise-grade test strategy document</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Config */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-800">Configuration</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
                {['5G Core Upgrade', 'Billing System v3', 'VoLTE Enhancement', 'IMS Migration'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900">
                <option value="enterprise">Enterprise Standard</option>
                <option value="agile">Agile Sprint-Based</option>
                <option value="telecom">Telecom/Network</option>
                <option value="iso">ISO 29119 Compliant</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Document Sections</p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {STRATEGY_SECTIONS.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                    <input type="checkbox" defaultChecked className="accent-blue-900 w-3.5 h-3.5" />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <button onClick={generate} disabled={loading} className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating…' : 'Generate Strategy'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="col-span-2">
          {!generated && !loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center h-full flex items-center justify-center">
              <div>
                <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Your generated Test Strategy will appear here</p>
                <p className="text-gray-400 text-sm mt-1">Configure options and click Generate</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center h-full flex items-center justify-center">
              <div>
                <Loader2 className="w-10 h-10 mx-auto text-blue-900 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Generating Test Strategy…</p>
                <p className="text-gray-400 text-sm mt-1">AI is analyzing requirements and project context</p>
              </div>
            </div>
          )}
          {generated && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="font-semibold text-gray-800">Test Strategy — {project}</p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-white"><Eye className="w-3.5 h-3.5" /> Preview</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs"><Download className="w-3.5 h-3.5" /> Export Word</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs"><Download className="w-3.5 h-3.5" /> Export PDF</button>
                </div>
              </div>
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">{generated}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
