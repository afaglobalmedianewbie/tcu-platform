'use client';
import React from 'react';
import { TenantResource } from '../../types/tenant';

interface TenantResourcesProps {
  resources: TenantResource;
}

export default function TenantResources({ resources }: TenantResourcesProps) {
  const pppoePct = (resources.activePppoeCount / resources.maxPppoeCount) * 100;
  const onuPct = (resources.activeOnuCount / resources.maxOnuCount) * 100;
  const bwPct = (resources.bandwidthUsageGbps / resources.bandwidthCapGbps) * 100;

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Alokasi Sumber Daya & Bandwidth (Limitasi)
      </h3>

      <div className="space-y-6">
        {/* PPPoE Sessions Limit */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
            <span className="text-slate-350">Sesi PPPoE Aktif</span>
            <span className="text-[#7B4DFF] font-black">
              {resources.activePppoeCount} / {resources.maxPppoeCount} User ({pppoePct.toFixed(1)}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950/45 rounded-full overflow-hidden">
            <div
              style={{ width: `${pppoePct}%` }}
              className="h-full rounded-full bg-violet-500 transition-all duration-550"
            />
          </div>
        </div>

        {/* ONU Signal / Device Limit */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
            <span className="text-slate-350">ONT / Perangkat ONU Terdaftar</span>
            <span className="text-sky-400 font-black">
              {resources.activeOnuCount} / {resources.maxOnuCount} ONU ({onuPct.toFixed(1)}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950/45 rounded-full overflow-hidden">
            <div
              style={{ width: `${onuPct}%` }}
              className="h-full rounded-full bg-sky-500 transition-all duration-550"
            />
          </div>
        </div>

        {/* Bandwidth Cap Limit */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs md:text-sm font-semibold">
            <span className="text-slate-350">Alokasi Uplink Bandwidth (Uplink Trunk)</span>
            <span className="text-emerald-400 font-black">
              {resources.bandwidthUsageGbps} Gbps / {resources.bandwidthCapGbps} Gbps ({bwPct.toFixed(1)}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950/45 rounded-full overflow-hidden">
            <div
              style={{ width: `${bwPct}%` }}
              className="h-full rounded-full bg-emerald-500 transition-all duration-550"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
