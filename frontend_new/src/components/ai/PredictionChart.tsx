'use client';
import React from 'react';

interface PredictionChartProps {
  riskScore: number;
}

export default function PredictionChart({ riskScore }: PredictionChartProps) {
  // Mock prediction progression over next 5 days
  const data = [
    { day: 'Hari Ini', score: riskScore },
    { day: 'Besok', score: Math.min(100, riskScore + 4) },
    { day: 'H+2', score: Math.min(100, riskScore + 8) },
    { day: 'H+3', score: Math.max(0, riskScore - 12) }, // predicted maintenance recovery dip
    { day: 'H+4', score: Math.max(0, riskScore - 30) }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Proyeksi Tingkat Risiko Gangguan (5 Hari Kedepan)
      </h3>

      <div className="flex justify-between items-end h-44 gap-4 mt-6">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold text-slate-400">{item.score}%</span>
            <div className="w-full bg-slate-950/50 rounded-lg overflow-hidden h-32 flex items-end">
              <div
                style={{ height: `${item.score}%` }}
                className={`w-full rounded-t-lg transition-all duration-500 ${
                  item.score > 80
                    ? 'bg-rose-500 shadow-lg shadow-rose-500/10'
                    : item.score > 50
                    ? 'bg-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-emerald-500 shadow-lg shadow-emerald-500/10'
                }`}
              />
            </div>
            <span className="text-[10px] md:text-xs text-slate-500 font-bold tracking-tight">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
