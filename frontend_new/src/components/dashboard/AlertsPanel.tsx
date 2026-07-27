'use client';
import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { useAlerts } from '../../hooks/useAlerts';

export default function AlertsPanel() {
  const { alerts } = useAdminStore();
  
  // Connect react query polling and websocket updates
  useAlerts();

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-rose-500/30 bg-rose-500/5 text-rose-400';
      case 'WARNING':
        return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
      default:
        return 'border-slate-800 bg-slate-950/20 text-slate-300';
    }
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base md:text-lg font-bold text-slate-200">
          NOC Real-time Alerts
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
        </span>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[350px] flex-1 pr-2">
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Tidak ada peringatan aktif.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex gap-3 items-start transition-all duration-300 ${
                getSeverityStyle(alert.severity)
              }`}
            >
              <span className="text-lg">
                {alert.severity === 'CRITICAL' ? '🔴' : alert.severity === 'WARNING' ? '⚠️' : 'ℹ️'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold leading-relaxed break-words">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                  <span>{alert.timestamp}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-400">{alert.source}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
