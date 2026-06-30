'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, RotateCcw, Copy } from 'lucide-react';
import toast from '@/lib/toast';
const suggestions = ['Generate test cases for login module','Analyze defect trends this sprint','What is missing from our test coverage?','Create a test strategy for payment gateway','Summarize today'"'"'s test execution results'];
type Msg = { role: 'user'|'assistant'; content: string; time: string };
const initialMsgs: Msg[] = [{ role:'assistant', content:'Hello! I'"'"'m your AI Test Manager. I can help you generate test cases, analyze defects, review requirements, create test strategies, and more. What would you like to work on today?', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }];
export default function AIAssistantPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initialMsgs);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [msgs]);
  const send = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const now = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    setMsgs(p => [...p, { role:'user', content:msg, time:now }]);
    setInput(''); setLoading(true);
    setTimeout(() => {
      setMsgs(p => [...p, { role:'assistant', content:`I'"'"'ve analyzed your request: **"${msg}"**\n\nBased on best practices for enterprise test management, here are my recommendations:\n\n1. **Test Coverage** — Ensure all critical paths are covered with at least 80% requirement traceability\n2. **Risk-Based Approach** — Prioritize high-risk modules like authentication and payment flows\n3. **Automation Strategy** — Target 70%+ automation for regression suites\n\nWould you like me to generate specific test cases or a detailed analysis?`, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }]);
      setLoading(false);
    }, 1500);
  };
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center"><Bot className="h-5 w-5 text-white" /></div>
          <div><h1 className="text-lg font-bold text-gray-900">AI Test Manager</h1><div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-green-500" /><span className="text-xs text-gray-500">Online · GPT-4o powered</span></div></div>
        </div>
        <button onClick={() => { setMsgs(initialMsgs); toast.info('Conversation cleared'); }} className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50"><RotateCcw className="h-3.5 w-3.5" />Clear</button>
      </div>
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role==='user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role==='assistant' ? 'bg-[#1e3a5f]' : 'bg-[#f97316]'}`}>
                {m.role==='assistant' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
              </div>
              <div className={`max-w-[75%] ${m.role==='user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${m.role==='assistant' ? 'bg-gray-50 text-gray-800' : 'bg-[#1e3a5f] text-white'}`}>
                  {m.content.split('\n').map((l,j) => <p key={j} className={l.startsWith('**') ? 'font-semibold' : ''}>{l.replace(/\*\*(.*?)\*\*/g,'$1')}</p>)}
                </div>
                <span className="text-[10px] text-gray-400">{m.time}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#1e3a5f] flex items-center justify-center shrink-0"><Bot className="h-4 w-4 text-white" /></div>
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-1.5">
                {[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay:`${i*150}ms`}} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-100 p-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.slice(0,3).map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors truncate max-w-[200px]">{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send())} placeholder="Ask your AI Test Manager anything…" className="flex-1 h-10 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" />
            <button onClick={() => send()} disabled={!input.trim()||loading} className="h-10 w-10 rounded-lg bg-[#1e3a5f] text-white flex items-center justify-center hover:bg-[#162b47] disabled:opacity-40 transition-colors"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
