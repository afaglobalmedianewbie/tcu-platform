'use client';
import React from 'react';
import { useDRStore } from '../../store/drStore';
import { useTriggerFailover } from '../../hooks/useDrQuery';

export default function FailoverModal() {
  const { failoverModalOpen, setFailoverModalOpen, isTriggeringFailover } = useDRStore();
  const mutation = useTriggerFailover();

  if (!failoverModalOpen) return null;

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-rose-950/20 animate-in fade-in-50 zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="text-4xl md:text-5xl mb-4 animate-bounce">🚨</div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100 mb-2">
            Konfirmasi Tindakan Kritis
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Anda akan memicu perpindahan rute darurat (*Failover*) ke **Singapura Datacenter**.
            Seluruh sesi PPPoE aktif akan terputus selama proses propagasi DNS & RADIUS. Tindakan ini berisiko tinggi.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setFailoverModalOpen(false)}
            disabled={isTriggeringFailover}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition duration-150 disabled:opacity-50"
          >
            Batalkan
          </button>
          <button
            onClick={handleConfirm}
            disabled={isTriggeringFailover}
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold shadow-lg shadow-rose-600/20 transition duration-150 disabled:opacity-50"
          >
            {isTriggeringFailover ? 'Proses...' : 'Ya, Failover'}
          </button>
        </div>
      </div>
    </div>
  );
}
