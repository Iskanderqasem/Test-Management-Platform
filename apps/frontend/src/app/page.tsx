'use client';

import { useState } from 'react';
import {
  FolderKanban, TestTube2, Bug, ShieldCheck, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, Zap, Brain,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const executionTrend = [
  { date: 'Jun 23', passed: 42, failed: 8, blocked: 3 },
  { date: 'Jun 24', passed: 55, failed: 12, blocked: 5 },
  { date: 'Jun 25', passed: 61, failed: 9, blocked: 2 },
  { date: 'Jun 26', passed: 70, failed: 7, blocked: 4 },
  { date: 'Jun 27', passed: 78, failed: 11, blocked: 3 },
  { date: 'Jun 28', passed: 85, failed: 6, blocked: 2 },
  { date: 'Jun 29', passed: 92, failed: 5, blocked: 1 },
];

const coverageData = [
  { module: 'Auth', coverage: 94 },
  { module: 'Billing', coverage: 78 },
  { module: 'Network', coverage: 85 },
  { module: 'Provisioning', coverage: 67 },
  { module: 'APIs', coverage: 91 },
  { module: 'UI', coverage: 73 },
];

const defectSeverity = [
  { name: 'Critical', value: 4, color: '#ef4444' },
  { name: 'High', value: 12, color: '#f97316' },
  { name: 'Medium', value: 28, color: '#eab308' },
  { name: 'Low', value: 35, color: '#22c55e' },
];

const projects = [
  { name: '5G Core Upgrade', status: 'In Progress', health: 'good', progress: 72, testCases: 340, defects: 8 },
  { name: 'Billing System v3', status: 'UAT', health: 'warning', progress: 88, testCases: 210, defects: 14 },
  { name: 'VoLTE Enhancement', status: 'Planning', health: 'good', progress: 25, testCases: 120, defects: 2 },
  { name: 'IMS Migration', status: 'Execution', health: 'critical', progress: 54, testCases: 480, defects: 31 },
];

const aiInsights = [
  { type: 'warning', message: 'Billing module coverage dropped below 80% threshold' },
  { type: 'info', message: '23 regression test cases identified for the IMS migration change' },
  { type: 'success', message: 'VoLTE smoke suite passed all 45 cases — ready for full regression' },
  { type: 'warning', message: '4 critical defects open in IMS Migration — release risk HIGH' },
];

const MetricCard = ({ icon: Icon, label, value, sub, color }: any) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const healthColor: Record<string, string> = {
  good: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  critical: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Enterprise Test Management Platform — AI-Powered QA Hub</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={FolderKanban} label="Active Projects" value="4" sub="2 approaching deadline" color="bg-blue-900" />
        <MetricCard icon={TestTube2} label="Total Test Cases" value="1,150" sub="89% with coverage" color="bg-indigo-600" />
        <MetricCard icon={Bug} label="Open Defects" value="55" sub="4 critical, 12 high" color="bg-orange-500" />
        <MetricCard icon={ShieldCheck} label="Avg Coverage" value="81%" sub="+3% from last sprint" color="bg-green-600" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Execution Trend */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Execution Trend — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={executionTrend}>
              <defs>
                <linearGradient id="passed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="failed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="passed" stroke="#22c55e" fill="url(#passed)" strokeWidth={2} />
              <Area type="monotone" dataKey="failed" stroke="#ef4444" fill="url(#failed)" strokeWidth={2} />
              <Area type="monotone" dataKey="blocked" stroke="#f97316" strokeDasharray="4 2" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Defect Severity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Open Defects by Severity</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={defectSeverity} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {defectSeverity.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {defectSeverity.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Coverage by Module */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Coverage by Module</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={coverageData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis dataKey="module" type="category" tick={{ fontSize: 11 }} width={85} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="coverage" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Project Health</h3>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${healthColor[p.health]}`}>{p.status}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-blue-900"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{p.testCases} cases</span>
                    <span>{p.defects} defects</span>
                    <span>{p.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-blue-900" />
            <h3 className="font-semibold text-gray-800">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((ins, i) => (
              <div key={i} className={`flex gap-2 p-2.5 rounded-lg text-sm ${
                ins.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                ins.type === 'critical' ? 'bg-red-50 text-red-800' :
                ins.type === 'success' ? 'bg-green-50 text-green-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                {ins.type === 'warning' ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> :
                 ins.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> :
                 <Zap className="w-4 h-4 shrink-0 mt-0.5" />}
                <p>{ins.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
