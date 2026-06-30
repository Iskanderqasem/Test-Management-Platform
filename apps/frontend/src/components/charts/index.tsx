'use client';

// Pure CSS/SVG charts — zero external dependencies

import React from 'react';
import { cn } from '@/lib/utils';

// ── Bar Chart ─────────────────────────────────────────────────────
export function BarChart({ data, height = 160, color = '#1e3a5f' }: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 w-full" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center gap-1 flex-1 min-w-0 h-full justify-end">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: 4 }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Line Sparkline ────────────────────────────────────────────────
export function Sparkline({ data, color = '#1e3a5f', height = 48 }: {
  data: number[];
  color?: string;
  height?: number;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = height;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────
export function DonutChart({ segments, size = 80 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const r = 30;
  const cx = 40;
  const cy = 40;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 80 80" style={{ width: size, height: size }}>
      {segments.map((s) => {
        const pct = s.value / total;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={s.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 40 40)"
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={cx} cy={cy} r="22" fill="white" />
    </svg>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────
export function ProgressRing({ value, size = 64, color = '#1e3a5f', label }: {
  value: number;
  size?: number;
  color?: string;
  label?: string;
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const fill = (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" style={{ width: size, height: size }} className="rotate-[-90deg]">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${fill} ${c - fill}`} strokeLinecap="round" />
      </svg>
      {label && (
        <span className="absolute text-xs font-bold text-gray-700">{label}</span>
      )}
    </div>
  );
}
