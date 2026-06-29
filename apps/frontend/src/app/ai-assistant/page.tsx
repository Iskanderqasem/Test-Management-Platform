'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Sparkles, Brain, FileText, TestTube2, Bug, BarChart3, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'Generate a test strategy for the 5G Core Upgrade project',
  'What test cases are missing for the billing requirements?',
  'Analyze the IMS migration defect trend and suggest actions',
  'Create an executive summary email for last week\'s UAT',
  'Identify regression risk for the latest billing CR',
  'What is the coverage gap in the provisioning module?',
];

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: `Hello! I'm your AI Test Manager. I can help you with:

• **Test Strategy & Planning** — Generate complete test strategies and plans from your requirements
• **Test Case Generation** — Create comprehensive test cases with all coverage types
• **Requirement Gap Analysis** — Identify missing requirements, acceptance criteria, and risks
• **Defect Analysis** — Root cause analysis, pattern detection, and fix suggestions
• **Log Analysis** — Analyze PCAP, SAS, and application logs to identify failures
• **Reporting** — Generate daily/weekly/release reports and professional emails
• **Knowledge Base** — Answer questions from previous test plans, defects, and CRs

What would you like to work on today?`,
  timestamp: new Date(),
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(text),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      {/* Sidebar */}
      <div className="w-72 shrink-0 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
          <div className="space-y-1.5">
            {[
              { icon: FileText, label: 'Generate Test Strategy', color: 'text-blue-700 bg-blue-50' },
              { icon: TestTube2, label: 'Generate Test Cases', color: 'text-green-700 bg-green-50' },
              { icon: Bug, label: 'Analyze Defects', color: 'text-red-700 bg-red-50' },
              { icon: BarChart3, label: 'Generate Report', color: 'text-purple-700 bg-purple-50' },
              { icon: Sparkles, label: 'Gap Analysis', color: 'text-orange-700 bg-orange-50' },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} onClick={() => send(label)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors">
                <div className={`p-1.5 rounded-md ${color}`}><Icon className="w-3.5 h-3.5" /></div>
                <span className="text-sm text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Suggested Prompts</p>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="w-full text-left text-xs text-gray-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors line-clamp-2">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a5f] to-blue-700 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">AI Test Manager</p>
            <p className="text-xs text-green-500 font-medium">● Online · Powered by GPT-4</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-gradient-to-br from-[#1e3a5f] to-blue-700' : 'bg-orange-500'}`}>
                {m.role === 'assistant' ? <Brain className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${m.role === 'assistant' ? 'bg-gray-50 text-gray-800 rounded-tl-sm' : 'bg-[#1e3a5f] text-white rounded-tr-sm'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                <p className={`text-xs mt-1.5 ${m.role === 'assistant' ? 'text-gray-400' : 'text-blue-200'}`}>
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e3a5f] to-blue-700 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
                <span className="text-sm text-gray-500">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-end gap-2">
            <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-400 hover:text-gray-600">
              <Paperclip className="w-4 h-4" />
              <input type="file" className="hidden" onChange={() => toast.success('File attached')} />
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about testing, requirements, defects, reports…"
              rows={2}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 resize-none"
            />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} className="p-2.5 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-xl disabled:opacity-40 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">AI may make mistakes. Always review generated documents before sharing.</p>
        </div>
      </div>
    </div>
  );
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('test strategy')) {
    return `I'll generate a comprehensive Test Strategy for you.\n\n**Test Strategy Document — 5G Core Upgrade**\n\nBased on the project information, here's what I'll include:\n\n1. **Introduction & Purpose** — Define testing objectives for the 5G NSA/SA upgrade\n2. **Test Scope** — IMS, HSS, PCF components in scope; PCRF (decommissioned) out of scope\n3. **Testing Levels** — Unit → Integration → System → Performance → UAT → PVT\n4. **Risk Assessment** — 3 critical risks identified: IMS fallback, charging correlation, VoLTE handover\n5. **Entry/Exit Criteria** — Defined per test phase\n6. **Resource Plan** — 8 test engineers, 2 automation specialists, 1 test lead\n7. **Environment Requirements** — SIT, UAT, Pre-PROD environments\n8. **Automation Strategy** — 70% automation target, Selenium + RestAssured\n\nShall I generate the full document now? I can export it to Word, PDF, or publish to Confluence.`;
  }
  if (lower.includes('defect') && lower.includes('analy')) {
    return `**IMS Migration Defect Trend Analysis**\n\n📊 **Summary:** 31 open defects, 4 critical\n\n**Pattern Identified:**\n• 68% of defects relate to IMS-to-HSS interface (Cx/Dx)\n• 3 critical defects share root cause: session state not preserved during HSS failover\n• Defect injection rate is 2.3× higher than project baseline\n\n**Root Cause Hypothesis:**\nThe HSS failover procedure does not synchronize subscriber data to the secondary node before responding. This causes IMS to use stale registration records.\n\n**Recommended Actions:**\n1. Raise P1 with Network Team to fix HSS sync timing\n2. Add 12 regression tests targeting HSS failover scenarios\n3. Hold go/no-go for UAT until critical defects resolved\n\nWould you like me to draft a risk escalation email to the project manager?`;
  }
  return `I've analyzed your request: **"${input}"**\n\nAs your AI Test Manager, I can help you with this. Based on the current project context:\n\n• I've identified the relevant requirements and test coverage\n• There are 3 potential gaps in the current test suite that relate to your query\n• I recommend generating additional boundary and negative test cases\n\nWould you like me to:\n1. Generate the test cases automatically?\n2. Produce a detailed gap analysis report?\n3. Draft an email summarizing the findings for your team?`;
}
