'use client'

import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ============================================================
// Color Palette
// ============================================================

export const CHART_COLORS = {
  primary: '#1e3a5f',
  accent: '#f97316',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
  teal: '#14b8a6',
  slate: '#64748b',
}

export const PIE_COLORS = [
  CHART_COLORS.danger,
  CHART_COLORS.warning,
  CHART_COLORS.accent,
  CHART_COLORS.info,
  CHART_COLORS.slate,
]

// ============================================================
// Custom Tooltip
// ============================================================

interface TooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md px-3 py-2">
      {label && <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600 capitalize">{entry.name.replace(/_/g, ' ')}: </span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// Execution Trends Chart
// ============================================================

const executionTrendsData = [
  { week: 'W1', passed: 42, failed: 8, blocked: 3, skipped: 2 },
  { week: 'W2', passed: 67, failed: 12, blocked: 5, skipped: 1 },
  { week: 'W3', passed: 89, failed: 9, blocked: 4, skipped: 3 },
  { week: 'W4', passed: 95, failed: 6, blocked: 2, skipped: 1 },
  { week: 'W5', passed: 112, failed: 14, blocked: 6, skipped: 4 },
  { week: 'W6', passed: 134, failed: 11, blocked: 3, skipped: 2 },
  { week: 'W7', passed: 148, failed: 8, blocked: 2, skipped: 1 },
  { week: 'W8', passed: 162, failed: 7, blocked: 1, skipped: 0 },
]

export function ExecutionTrendsChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={executionTrendsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="passGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.2} />
            <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="failGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.2} />
            <stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        <Area type="monotone" dataKey="passed" stroke={CHART_COLORS.success} strokeWidth={2} fill="url(#passGradient)" name="Passed" />
        <Area type="monotone" dataKey="failed" stroke={CHART_COLORS.danger} strokeWidth={2} fill="url(#failGradient)" name="Failed" />
        <Line type="monotone" dataKey="blocked" stroke={CHART_COLORS.warning} strokeWidth={2} dot={false} name="Blocked" strokeDasharray="4 2" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Defect Severity Chart
// ============================================================

const defectSeverityData = [
  { name: 'Critical', value: 8 },
  { name: 'Major', value: 23 },
  { name: 'Moderate', value: 41 },
  { name: 'Minor', value: 29 },
  { name: 'Trivial', value: 12 },
]

const RADIAN = Math.PI / 180
interface LabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelProps) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  if (percent < 0.06) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function DefectSeverityChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={defectSeverityData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          dataKey="value"
        >
          {defectSeverityData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Coverage Bar Chart
// ============================================================

const coverageData = [
  { module: 'Auth', coverage: 94, target: 95 },
  { module: 'Payment', coverage: 78, target: 90 },
  { module: 'Orders', coverage: 85, target: 90 },
  { module: 'Profile', coverage: 91, target: 85 },
  { module: 'Search', coverage: 67, target: 80 },
  { module: 'Reports', coverage: 72, target: 85 },
  { module: 'Admin', coverage: 88, target: 90 },
]

export function CoverageBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={coverageData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="module" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        <Bar dataKey="coverage" name="Coverage %" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
        <Bar dataKey="target" name="Target %" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} opacity={0.5} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Defect Trend Line Chart
// ============================================================

const defectTrendData = [
  { date: 'Jun 1', opened: 5, closed: 3, total: 45 },
  { date: 'Jun 5', opened: 8, closed: 6, total: 47 },
  { date: 'Jun 10', opened: 4, closed: 9, total: 42 },
  { date: 'Jun 15', opened: 12, closed: 7, total: 47 },
  { date: 'Jun 20', opened: 6, closed: 11, total: 42 },
  { date: 'Jun 25', opened: 3, closed: 8, total: 37 },
  { date: 'Jun 29', opened: 7, closed: 5, total: 39 },
]

export function DefectTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={defectTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        <Line type="monotone" dataKey="opened" stroke={CHART_COLORS.danger} strokeWidth={2} dot={{ r: 3 }} name="Opened" />
        <Line type="monotone" dataKey="closed" stroke={CHART_COLORS.success} strokeWidth={2} dot={{ r: 3 }} name="Closed" />
        <Line type="monotone" dataKey="total" stroke={CHART_COLORS.warning} strokeWidth={2} dot={false} name="Total Open" strokeDasharray="5 3" />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ============================================================
// Sprint Velocity Chart
// ============================================================

const velocityData = [
  { sprint: 'S18', planned: 42, actual: 38 },
  { sprint: 'S19', planned: 45, actual: 44 },
  { sprint: 'S20', planned: 40, actual: 41 },
  { sprint: 'S21', planned: 48, actual: 43 },
  { sprint: 'S22', planned: 46, actual: 47 },
  { sprint: 'S23', planned: 50, actual: 49 },
]

export function SprintVelocityChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={velocityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
        <Bar dataKey="planned" name="Planned" fill={CHART_COLORS.slate} radius={[3, 3, 0, 0]} />
        <Bar dataKey="actual" name="Actual" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
