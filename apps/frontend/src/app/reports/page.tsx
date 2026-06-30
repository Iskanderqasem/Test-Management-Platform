'use client';
import React, { useState } from 'react';
import { Download, BarChart3, TrendingUp, Bug, CheckCircle2, FileText, Zap } from 'lucide-react';
import toast from '@/lib/toast';
const metrics = [
  {label:'Total Test Cases',value:'1,733',change:'+12%',up:true,icon:FileText,color:'text-[#1e3a5f]'},
  {label:'Pass Rate',value:'91.2%',change:'+3.8%',up:true,icon:CheckCircle2,color:'text-green-600'},
  {label:'Open Defects',value:'34',change:'-5',up:true,icon:Bug,color:'text-red-600'},
  {label:'Automation %',value:'68%',change:'+4%',up:true,icon:Zap,color:'text-purple-600'},
];
const sprintData = [
  {sprint:'S20',pass:82,fail:14,blocked:4},{sprint:'S21',pass:85,fail:11,blocked:4},{sprint:'S22',pass:88,fail:9,blocked:3},{sprint:'S23',pass:91,fail:7,blocked:2},
];
export default function ReportsPage() {
  const [active, setActive] = useState('overview');
  const tabs = ['overview','execution','defects','coverage'];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1><p className="text-sm text-gray-400">Quality metrics and trends</p></div>
        <button onClick={() => toast.success('Report exported!')} className="flex items-center gap-1.5 h-8 px-4 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"><Download className="h-3.5 w-3.5" />Export PDF</button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{m.label}</p>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </div>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className={`text-xs mt-1 ${m.up?'text-green-600':'text-red-500'}`}>{m.change} vs last sprint</p>
          </div>
        ))}
      </div>
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${active===t?'border-[#1e3a5f] text-[#1e3a5f]':'border-transparent text-gray-500 hover:text-gray-700'}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Pass Rate Trend — Last 4 Sprints</h3>
          <div className="space-y-3">
            {sprintData.map(d => (
              <div key={d.sprint} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-500 w-8">{d.sprint}</span>
                <div className="flex-1 flex h-5 rounded-md overflow-hidden gap-0.5">
                  <div className="bg-green-500 h-full flex items-center justify-center" style={{width:`${d.pass}%`}}><span className="text-[9px] text-white font-bold">{d.pass}%</span></div>
                  <div className="bg-red-400 h-full" style={{width:`${d.fail}%`}} />
                  <div className="bg-orange-300 h-full" style={{width:`${d.blocked}%`}} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            {[{c:'bg-green-500',l:'Passed'},{c:'bg-red-400',l:'Failed'},{c:'bg-orange-300',l:'Blocked'}].map(x=>(
              <div key={x.l} className="flex items-center gap-1.5"><div className={`h-2.5 w-2.5 rounded-full ${x.c}`}/><span className="text-xs text-gray-500">{x.l}</span></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Defect Distribution by Severity</h3>
          <div className="space-y-3">
            {[{l:'Critical',n:8,c:'bg-red-500',pct:24},{l:'Major',n:12,c:'bg-orange-500',pct:35},{l:'Moderate',n:9,c:'bg-yellow-400',pct:26},{l:'Minor',n:5,c:'bg-blue-400',pct:15}].map(d=>(
              <div key={d.l} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-20">{d.l}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${d.c}`} style={{width:`${d.pct}%`}} /></div>
                <span className="text-xs font-bold text-gray-700 w-6">{d.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
