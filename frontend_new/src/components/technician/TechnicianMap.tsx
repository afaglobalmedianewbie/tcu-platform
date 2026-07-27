'use client';
import React from 'react';
import { TechnicianLocation } from '../../types/technician';

interface TechnicianMapProps {
  location: TechnicianLocation | null;
}

export default function TechnicianMap({ location }: TechnicianMapProps) {
  if (!location) {
    return (
      <div className="h-64 bg-slate-900/30 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs md:text-sm">
        Mendapatkan kordinat GPS...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base md:text-lg font-bold text-slate-200">
          Posisi GPS Teknisi (Live)
        </h3>
        <span className="text-[10px] text-slate-500 font-semibold">
          Akurasi: {location.accuracy}m
        </span>
      </div>

      <div className="h-60 rounded-xl bg-slate-950/40 border border-slate-850/60 flex items-center justify-center relative overflow-hidden">
        {/* Simple map vector outline mockup for location tracking */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-1 text-center">
          <div className="relative inline-block mb-3">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-violet-400 opacity-60 -left-2 -top-2"></span>
            <span className="relative text-3xl">📍</span>
          </div>
          <h4 className="text-xs md:text-sm font-bold text-slate-200">
            Kordinat Aktif
          </h4>
          <p className="text-[10px] md:text-xs text-slate-500 mt-1">
            Lat: {location.latitude.toFixed(4)} • Lng: {location.longitude.toFixed(4)}
          </p>
          <span className="inline-block mt-3 text-[9px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-black tracking-widest uppercase">
            Updated: {location.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
