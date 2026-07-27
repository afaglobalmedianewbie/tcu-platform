'use client';

import React, { useState } from 'react';
import { useAiPredict } from '../../../../hooks/useAi';
import RiskScore from '../../../../components/ai/RiskScore';
import PredictionChart from '../../../../components/ai/PredictionChart';
import RoleGuard from '../../../../components/rbac/RoleGuard';

export default function AiPredictivePage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CST-001');
  const { data: predict, isLoading } = useAiPredict(selectedCustomerId);

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPERADMIN', 'NOC', 'TEKNISI', 'TECHNICIAN', 'OPERATOR']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Terbatas</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Izin Anda tidak mencukupi untuk mengakses modul AI Predictive Engine.
          </p>
        </div>
      }
    >
      <div className="animate-in fade-in duration-500">
        
        {/* Header */}
        <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <span className="text-[#7B4DFF]">🤖</span> AI Predictive Engine
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Analisis prediktif kelayakan penerima sinyal ONU dan deteksi dini risiko gangguan FTTH.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Cari Customer ID..."
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-[#7B4DFF] focus:border-[#7B4DFF] flex-1 md:w-48"
            />
          </div>
        </header>

        {isLoading || !predict ? (
          <div className="h-64 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RiskScore predict={predict} />
            <PredictionChart riskScore={predict.riskScore} />
          </div>
        )}

      </div>
    </RoleGuard>
  );
}
