'use client';
import React from 'react';
import { PredictRisk } from '../../types/ai';

interface RiskScoreProps {
  predict: PredictRisk;
}

export default function RiskScore({ predict }: RiskScoreProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-500 border-rose-500/25 bg-rose-500/5';
      case 'HIGH': return 'text-amber-500 border-amber-500/25 bg-amber-500/5';
      case 'MEDIUM': return 'text-sky-500 border-sky-500/25 bg-sky-500/5';
      default: return 'text-emerald-500 border-emerald-500/25 bg-emerald-500/5';
    }
  };

  return (
    <div className={`p-6 md:p-8 rounded-2xl border backdrop-blur-md ${getRiskColor(predict.riskLevel)}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">AI Risk Engine</span>
          <h3 className="text-lg font-black text-slate-100 mt-1">{predict.customerName}</h3>
        </div>
        <span className="text-sm font-black px-3 py-1 bg-black/35 rounded-xl border border-white/5 uppercase tracking-wider">
          {predict.riskLevel}
        </span>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="text-4xl md:text-5xl font-black text-slate-100">
          {predict.riskScore}%
        </div>
        <div className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
          Probabilitas gangguan atau putusnya koneksi dalam estimasi 48 jam ke depan berdasarkan pola redaman sinyal GPON.
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-800/60 pt-6 mt-6">
        <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">Faktor Anomali Terdeteksi:</h4>
        <ul className="space-y-2 text-xs md:text-sm text-slate-400 list-disc list-inside">
          {predict.factors.map((f, i) => (
            <li key={i} className="leading-relaxed">{f}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-950/40 border border-slate-850 text-xs md:text-sm text-slate-300 leading-relaxed font-semibold">
        💡 <span className="text-[#7B4DFF]">Rekomendasi Tindakan:</span> {predict.recommendation}
      </div>
    </div>
  );
}
