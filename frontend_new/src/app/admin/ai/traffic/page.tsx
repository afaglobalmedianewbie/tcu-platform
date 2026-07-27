'use client';

import React from 'react';
import { useAiTrafficOverview } from '../../../../hooks/useAi';
import TrafficChart from '../../../../components/ai/TrafficChart';
import AnomalyTable from '../../../../components/ai/AnomalyTable';
import RoleGuard from '../../../../components/rbac/RoleGuard';

export default function AiTrafficPage() {
  const { data: traffic, isLoading } = useAiTrafficOverview();

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPERADMIN', 'NOC', 'TEKNISI', 'TECHNICIAN', 'OPERATOR']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-sans">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Terbatas</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Izin Anda tidak mencukupi untuk mengakses modul AI Traffic Load Analyzer.
          </p>
        </div>
      }
    >
      <div className="animate-in fade-in duration-500 space-y-8">
        
        {/* Header */}
        <header>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
            <span className="text-[#7B4DFF]">📈</span> AI Traffic Load Analyzer
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Analisis beban jaringan waktu-nyata, deteksi dini spike tak wajar, dan identifikasi anomali routing.
          </p>
        </header>

        {isLoading || !traffic ? (
          <div className="space-y-6">
            <div className="h-48 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
            <div className="h-64 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <>
            <TrafficChart spikes={traffic.spikes} />
            <AnomalyTable anomalies={traffic.anomalies} />
          </>
        )}

      </div>
    </RoleGuard>
  );
}
