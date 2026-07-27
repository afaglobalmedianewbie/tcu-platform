'use client';

import React from 'react';
import { useDRStore } from '../../../store/drStore';
import { useDRStatus, useDRLogs } from '../../../hooks/useDrQuery';
import DrStatusBanner from '../../../components/dr/DrStatusBanner';
import DrNodeCard from '../../../components/dr/DrNodeCard';
import FailoverModal from '../../../components/dr/FailoverModal';
import RoleGuard from '../../../components/rbac/RoleGuard';

export default function DisasterRecoveryPage() {
  const { nodes, setFailoverModalOpen } = useDRStore();
  
  // Activate React Query polling and fetching
  const { isLoading: statusLoading } = useDRStatus();
  const { data: logs, isLoading: logsLoading } = useDRLogs();

  return (
    <RoleGuard
      allowedRoles={['SUPERADMIN']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Ditolak</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Anda tidak memiliki izin yang cukup untuk mengakses halaman Disaster Recovery & Failover.
          </p>
        </div>
      }
    >
      <div className="animate-in fade-in-50 duration-500 max-w-7xl mx-auto">
        <header className="mb-8 md:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 flex items-center gap-3">
              <span className="text-[#7B4DFF]">🛡️</span> Disaster Recovery & Failover
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Manajemen High-Availability dan Sinkronisasi Replikasi Multi-Region
            </p>
          </div>

          <button
            onClick={() => setFailoverModalOpen(true)}
            className="w-full md:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-black rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-600/35 transition-all duration-200"
          >
            ⚠️ AKTIFKAN FAILOVER DARURAT
          </button>
        </header>

        {/* Global Replication Status Banner */}
        <DrStatusBanner />

        {/* Node Configuration */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-300 mb-6 flex items-center gap-2">
            <span>🌐</span> Status Node Regional
          </h2>
          {statusLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nodes.map((node) => (
                <DrNodeCard key={node.id} node={node} />
              ))}
            </div>
          )}
        </section>

        {/* Visual Charts & Event Logs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Replica Traffic Chart */}
          <div className="lg:col-span-2 p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
            <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
              Trafik Sinkronisasi Replikasi
            </h3>
            {/* Visual SVG mock representing the chart */}
            <div className="h-64 flex items-end justify-between relative border-b border-l border-slate-800/80 pb-2 pl-2">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B4DFF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7B4DFF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d="M 0 200 Q 80 180 160 120 T 320 80 T 480 150 T 640 60 L 640 256 L 0 256 Z"
                  fill="url(#purpleGlow)"
                  className="transition-all duration-300"
                />
                {/* Line path */}
                <path
                  d="M 0 200 Q 80 180 160 120 T 320 80 T 480 150 T 640 60"
                  fill="none"
                  stroke="#7B4DFF"
                  strokeWidth="3"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute top-2 right-2 flex items-center gap-2 bg-slate-950/60 py-1 px-3 rounded-lg border border-slate-800/40">
                <div className="w-2.5 h-2.5 rounded-full bg-[#7B4DFF]" />
                <span className="text-[10px] text-slate-400 font-medium">Auto-Sync Rate</span>
              </div>
              <div className="w-full flex justify-between absolute -bottom-6 left-0 text-[10px] text-slate-500 font-medium">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Sekarang</span>
              </div>
            </div>
          </div>

          {/* DR Logs */}
          <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col">
            <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
              Log Kejadian DR
            </h3>
            {logsLoading ? (
              <div className="space-y-4 flex-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-slate-900/30 border border-slate-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto max-h-64 flex-1 pr-2">
                {logs?.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl bg-slate-950/30 border border-slate-800/50 flex gap-3 items-start">
                    <span className="text-base">
                      {log.status === 'SUCCESS' ? '🟢' : log.status === 'WARNING' ? '⚠️' : '🔴'}
                    </span>
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-200">
                        {log.event}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                        <span className="text-[10px] text-[#7B4DFF]/70 font-semibold uppercase">{log.operator}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dangerous action modal dialog */}
        <FailoverModal />
      </div>
    </RoleGuard>
  );
}
