'use client';
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color?: 'violet' | 'emerald' | 'amber' | 'rose';
}

export default function KpiCard({
  title,
  value,
  change,
  icon,
  color = 'violet'
}: KpiCardProps) {
  const isPositive = change >= 0;

  const colorClasses = {
    violet: 'border-violet-500/20 text-violet-400 bg-violet-500/5',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
    rose: 'border-rose-500/20 text-rose-400 bg-rose-500/5'
  };

  return (
    <div className={`p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-950/10 ${
      colorClasses[color]
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-xl">{icon}</span>
        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
        }`}>
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </span>
      </div>
      <div className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
        {value}
      </div>
      <div className="text-xs md:text-sm text-slate-400 font-medium mt-1">
        {title}
      </div>
    </div>
  );
}
