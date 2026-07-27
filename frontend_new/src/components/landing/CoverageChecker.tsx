'use client';

import React from 'react';
import { MapPin, Search } from 'lucide-react';

interface CoverageCheckerProps {
  coverageText: string;
}

export default function CoverageChecker({ coverageText }: CoverageCheckerProps) {
  const areas = ['Pangandaran', 'Banjar', 'Ciamis', 'Tasikmalaya', 'Indramayu', 'Garut'];

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#0b1120] relative overflow-hidden">
      {/* Subtle Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%237c3aed\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-3xl p-6 sm:p-10 text-center shadow-xl shadow-black/20">
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30 mb-6">
            <MapPin className="w-8 h-8 text-violet-400" />
          </div>

          <h2 className="text-[1.75rem] sm:text-3xl font-black font-['Outfit'] text-slate-100 mb-3">
            Cek Jangkauan Area Kamu
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl mx-auto">
            Pastikan lokasimu sudah tercover jaringan Fiber Optic Top Class Universal untuk menikmati internet super cepat.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Masukkan kecamatan atau desa..."
                className="w-full h-[52px] bg-[#0f172a]/80 border border-[#334155] text-slate-200 placeholder:text-slate-500 rounded-xl pl-12 pr-4 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
            <button 
              type="submit"
              className="h-[52px] px-8 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 shrink-0"
            >
              Cek Sekarang
            </button>
          </form>

          <div>
            <p className="text-sm text-slate-400 font-medium mb-4">Area Coverage Kami Saat Ini:</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {areas.map(area => (
                <span 
                  key={area}
                  className="bg-[#0f172a] border border-[#334155] hover:border-violet-500/40 text-slate-300 px-4 py-2 rounded-full text-sm transition-colors cursor-default"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              {coverageText}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
