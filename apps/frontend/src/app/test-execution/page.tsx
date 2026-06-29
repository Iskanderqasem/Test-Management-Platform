'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Plus, Clock, CheckCircle2, XCircle, Ban, SkipForward, BarChart3 } from 'lucide-react';

const RUNS = [
  { id: 'RUN-001', name: 'Sprint 4 Regression — 5G Core', project: '5G Core Upgrade', status: 'In Progress', total: 120, passed: 78, failed: 8, blocked: 3, notRun: 31, startedAt: '2026-06-29 08:30', executor: 'Sarah Chen', env: 'SIT' },
  { id: 'RUN-002', name: 'Billing v3 UAT Cycle 2', project: 'Billing System v3', status: 'Completed', total: 85, passed: 71, failed: 14, blocked: 0, notRun: 0, startedAt: '2026-06-28 14:00', executor: 'James Patel', env: 'UAT' },
  { id: 'RUN-003', name: 'VoLTE Smoke Test', project: 'VoLTE Enhancement', status: 'Completed', total: 20, passed: 20, failed: 0, blocked: 0, notRun: 0, startedAt: '2026-06-28 09:00', executor: 'Li Wei', env: 'SIT' },
  { id: 'RUN-004', name: 'IMS Migration System Test', project: 'IMS Migration', status: 'Paused', total: 240, passed: 130, failed: 31, blocked: 12, notRun: 67, startedAt: '2026-06-27 10:00', executor: 'Omar Hassan', env: 'SIT' },
];

const statusColor: Record<string, string> = {
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Paused: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
};

export default function TestExecutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Execution</h1>
          <p className="text-gray-500 mt-1">Manage and monitor test runs across all projects</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] hover:bg-[#16304f] text-white rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" /> New Test Run
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Runs', value: 1, icon: Play, color: 'bg-blue-900 text-white' },
          { label: 'Total Passed', value: 299, icon: CheckCircle2, color: 'bg-green-500 text-white' },
          { label: 'Total Failed', value: 53, icon: XCircle, color: 'bg-red-500 text-white' },
          { label: 'Blocked', value: 15, icon: Ban, color: 'bg-orange-500 text-white' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Runs List */}
      <div className="space-y-4">
        {RUNS.map((run) => {
          const pct = Math.round((run.passed / run.total) * 100);
          return (
            <div key={run.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-gray-400">{run.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[run.status]}`}>{run.status}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{run.env}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{run.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{run.project} · {run.executor} · Started {run.startedAt}</p>
                </div>
                <div className="flex gap-2">
                  {run.status === 'In Progress' && (
                    <Link href={`/test-execution/run/${run.id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium">
                      <Play className="w-3.5 h-3.5" /> Continue
                    </Link>
                  )}
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                    <BarChart3 className="w-3.5 h-3.5" /> Results
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Execution Progress</span>
                  <span>{run.total - run.notRun}/{run.total} ({100 - Math.round(run.notRun / run.total * 100)}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 flex overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${(run.passed / run.total) * 100}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${(run.failed / run.total) * 100}%` }} />
                  <div className="bg-orange-400 h-full" style={{ width: `${(run.blocked / run.total) * 100}%` }} />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-5 gap-3">
                {[
                  { label: 'Total', value: run.total, color: 'text-gray-800' },
                  { label: 'Passed', value: run.passed, color: 'text-green-600' },
                  { label: 'Failed', value: run.failed, color: 'text-red-600' },
                  { label: 'Blocked', value: run.blocked, color: 'text-orange-500' },
                  { label: 'Not Run', value: run.notRun, color: 'text-gray-400' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
