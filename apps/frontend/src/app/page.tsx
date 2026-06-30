'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Bug, CheckCircle2, AlertCircle,
  Clock, Play, Zap, ArrowRight, Activity, BarChart3,
  FileText, TestTube, Target, Shield, AlertTriangle,
  ChevronRight, Circle, CheckCheck, XCircle, Pause,
} from 'lucide-react';

function KpiCard({ label, value, sub, trend, trendUp, color }: {
  label: string; value: string | number; sub: string;
  trend?: string; trendUp?: boolean; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function MiniProgress({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700',
    'Planning': 'bg-blue-100 text-blue-700',
    'On Hold': 'bg-yellow-100 text-yellow-700',
    'Critical': 'bg-red-100 text-red-700',
    'Passed': 'bg-green-100 text-green-700',
    'Failed': 'bg-red-100 text-red-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Blocked': 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

const projects = [
  { name: 'Payment Gateway v3.2', progress: 78, pass: 94, total: 234, status: 'Active', priority: 'High' },
  { name: 'Mobile App Release 5.1', progress: 45, pass: 71, total: 189, status: 'Active', priority: 'Critical' },
  { name: 'API Integration Suite', progress: 92, pass: 98, total: 156, status: 'Active', priority: 'Medium' },
  { name: 'Dashboard Redesign', progress: 20, pass: 60, total: 45, status: 'Planning', priority: 'Low' },
];

const recentDefects = [
  { id: 'DEF-0142', title: 'Payment fails on Visa cards > $500', severity: 'Critical', status: 'In Progress', assignee: 'IQ' },
  { id: 'DEF-0141', title: 'Login timeout not enforced on mobile', severity: 'Major', status: 'Blocked', assignee: 'SA' },
  { id: 'DEF-0139', title: 'Export PDF missing header row', severity: 'Minor', status: 'In Progress', assignee: 'MK' },
  { id: 'DEF-0138', title: 'Push notification delayed by 30s', severity: 'Moderate', status: 'In Progress', assignee: 'IQ' },
];

const recentActivity = [
  { icon: CheckCircle2, color: 'text-green-500', msg: 'Test run "Sprint 23 Regression" completed — 94% pass', time: '10m ago' },
  { icon: Bug, color: 'text-red-500', msg: 'DEF-0142 assigned to Iskander Qasem', time: '45m ago' },
  { icon: Zap, color: 'text-purple-500', msg: 'AI generated 47 test cases for Payment module', time: '2h ago' },
  { icon: AlertCircle, color: 'text-yellow-500', msg: 'Staging environment degraded — response time 3.2s', time: '3h ago' },
  { icon: Play, color: 'text-blue-500', msg: 'Test plan "API v2 Smoke" started by Sara Ahmed', time: '5h ago' },
  { icon: FileText, color: 'text-gray-400', msg: 'Requirements gap analysis completed for Sprint 24', time: '1d ago' },
];

const execResults = [
  { label: 'Passed', count: 1284, pct: 74, color: 'bg-green-500', textColor: 'text-green-600' },
  { label: 'Failed', count: 186, pct: 11, color: 'bg-red-500', textColor: 'text-red-600' },
  { label: 'Blocked', count: 124, pct: 7, color: 'bg-orange-400', textColor: 'text-orange-600' },
  { label: 'Skipped', count: 139, pct: 8, color: 'bg-gray-300', textColor: 'text-gray-500' },
];

const severityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  Major: 'bg-orange-100 text-orange-700 border-orange-200',
  Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Minor: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/test-cases/generate" className="flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#1e3a5f] text-white text-xs font-semibold hover:bg-[#162b47] transition-colors shadow-sm">
            <Zap className="h-3.5 w-3.5" /> Generate Test Cases
          </Link>
          <Link href="/test-execution" className="flex items-center gap-1.5 h-8 px-4 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
            <Play className="h-3.5 w-3.5" /> Run Tests
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Pass Rate" value="91.2%" sub="vs 87.4% last sprint" trend="+3.8%" trendUp color="text-green-600" />
        <KpiCard label="Active Tests" value="1,733" sub="across 4 projects" trend="+12%" trendUp color="text-[#1e3a5f]" />
        <KpiCard label="Open Defects" value="34" sub="8 critical severity" trend="-5" trendUp color="text-red-600" />
        <KpiCard label="Automation %" value="68%" sub="target: 80%" trend="+4%" trendUp color="text-purple-600" />
        <KpiCard label="Avg Cycle Time" value="2.4d" sub="from open to close" trend="-0.3d" trendUp color="text-orange-600" />
        <KpiCard label="Requirements" value="247" sub="18 pending review" color="text-blue-600" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#1e3a5f]" /> Active Projects
            </h2>
            <Link href="/projects" className="text-xs text-[#1e3a5f] font-semibold flex items-center gap-1 hover:underline">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {projects.map((p) => (
              <div key={p.name} className="px-5 py-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1e3a5f] truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={p.status} />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${p.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' : p.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {p.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className={`text-lg font-bold ${p.pass >= 90 ? 'text-green-600' : p.pass >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>{p.pass}%</p>
                    <p className="text-[10px] text-gray-400">pass rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <MiniProgress value={p.progress} color={p.progress > 80 ? 'bg-green-500' : p.progress > 50 ? 'bg-blue-500' : 'bg-orange-400'} />
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{p.progress}% complete</span>
                  <span className="text-xs text-gray-400 shrink-0">{p.total} cases</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#1e3a5f]" /> Execution Status
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Last 7 days · 1,733 total</p>
          </div>
          <div className="px-5 pt-4">
            <div className="flex rounded-full overflow-hidden h-3">
              {execResults.map((r) => (
                <div key={r.label} className={`${r.color} h-full`} style={{ width: `${r.pct}%` }} />
              ))}
            </div>
          </div>
          <div className="px-5 py-4 space-y-3.5">
            {execResults.map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${r.color}`} />
                  <span className="text-sm text-gray-600">{r.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${r.textColor}`}>{r.count.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 w-7 text-right">{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <Link href="/test-execution" className="flex items-center justify-center gap-1.5 w-full h-8 rounded-lg border border-[#1e3a5f] text-[#1e3a5f] text-xs font-semibold hover:bg-[#1e3a5f] hover:text-white transition-colors">
              Full Report <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Defects Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Bug className="h-4 w-4 text-red-500" /> Open Defects
            </h2>
            <Link href="/defects" className="text-xs text-[#1e3a5f] font-semibold flex items-center gap-1 hover:underline">
              View all 34 <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500">ID</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">Title</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">Severity</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDefects.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3">
                      <span className="text-xs font-mono font-bold text-[#1e3a5f]">{d.id}</span>
                    </td>
                    <td className="px-3 py-3 max-w-[200px]">
                      <p className="text-xs font-medium text-gray-800 truncate">{d.title}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold ${severityColors[d.severity]}`}>
                        {d.severity}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-6 w-6 rounded-full bg-[#1e3a5f] text-white text-[10px] font-bold flex items-center justify-center">
                        {d.assignee}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#1e3a5f]" /> Recent Activity
            </h2>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto max-h-72">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <a.icon className={`h-4 w-4 shrink-0 mt-0.5 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-snug">{a.msg}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-[#0f2744] to-[#1e3a5f] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-[#f97316]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">AI Test Manager</p>
            <p className="text-slate-400 text-xs">Generate strategies, analyze defects, identify coverage gaps</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {['Generate test cases', 'Analyze defect trends', 'Coverage gap report', 'Open AI Assistant'].map((action) => (
            <Link key={action} href="/ai-assistant" className="h-7 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10 flex items-center">
              {action}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
