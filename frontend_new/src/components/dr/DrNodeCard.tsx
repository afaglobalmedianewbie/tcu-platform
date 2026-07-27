'use client';
import React from 'react';
import { DRNode } from '../../types/dr';

interface DrNodeCardProps {
  node: DRNode;
}

export default function DrNodeCard({ node }: DrNodeCardProps) {
  const isActive = node.status === 'ACTIVE';
  const isOffline = node.status === 'OFFLINE';

  return (
    <div className={`relative overflow-hidden p-6 md:p-8 rounded-2xl border transition-all duration-300 bg-slate-900/40 backdrop-blur-md ${
      isActive
        ? 'border-violet-500/40 shadow-lg shadow-violet-500/5'
        : isOffline
        ? 'border-rose-500/30'
        : 'border-slate-800'
    }`}>
      {/* Background radial glow for active node */}
      {isActive && (
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="relative z-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] md:text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Datacenter Node
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-100 mt-1">
              {node.region}
            </h3>
          </div>
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
            isActive
              ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
              : isOffline
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
          }`}>
            {node.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] md:text-xs text-slate-500 block mb-1">
              Traffic
            </span>
            <span className="text-sm md:text-base font-bold text-slate-200">
              {node.traffic}
            </span>
          </div>
          <div>
            <span className="text-[10px] md:text-xs text-slate-500 block mb-1">
              Latency
            </span>
            <span className="text-sm md:text-base font-bold text-slate-200">
              {node.ping}
            </span>
          </div>
          <div>
            <span className="text-[10px] md:text-xs text-slate-500 block mb-1">
              Replica Lag
            </span>
            <span className="text-sm md:text-base font-bold text-slate-200">
              {node.dbLag}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
