'use client';

import React from 'react';
import { ArrowRight, MapPin, CheckCircle, ChevronDown, Activity } from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  cmsData?: any;
}

export default function Hero({ cmsData }: HeroProps) {
  return (
    <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#0b1120]">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/8 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Announcement Badge */}
          <div className="animate-fade-in-up flex items-center gap-2 bg-[#1e293b]/80 backdrop-blur border border-[#334155] rounded-full px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-300">Fiber Optic 100% FTTH</span>
          </div>

          {/* Heading */}
          {cmsData?.landing_heroTitle ? (
            <h1 
              className="animate-fade-in-up animation-delay-100 text-[2.2rem] sm:text-5xl lg:text-7xl font-black font-['Outfit'] tracking-tight leading-[1.1] text-slate-100 mb-6"
              dangerouslySetInnerHTML={{ __html: cmsData.landing_heroTitle }}
            />
          ) : (
            <h1 className="animate-fade-in-up animation-delay-100 text-[2.2rem] sm:text-5xl lg:text-7xl font-black font-['Outfit'] tracking-tight leading-[1.1] text-slate-100 mb-6">
              Internet Fiber Optic<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                Super Cepat & Stabil
              </span>
            </h1>
          )}

          {/* Subtext */}
          <p className="animate-fade-in-up animation-delay-200 text-sm sm:text-base lg:text-lg text-slate-400 max-w-[560px] mx-auto mb-10 font-['Inter'] leading-relaxed">
            {cmsData?.landing_heroSubtitle || "Nikmati pengalaman internet tanpa batas kuota dengan jaringan 100% Fiber Optic dari Top Class Universal. Cocok untuk streaming, gaming, dan bisnis."}
          </p>

          {/* CTA Row */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12">
            <Link 
              href="/register"
              className="w-full sm:w-auto min-h-[50px] sm:min-h-[46px] flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold px-8 rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              Daftar Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/coverage"
              className="w-full sm:w-auto min-h-[50px] sm:min-h-[46px] flex items-center justify-center gap-2 bg-[#1e293b]/60 hover:bg-[#1e293b] backdrop-blur border border-[#334155] text-white font-semibold px-8 rounded-xl transition-all"
            >
              <MapPin className="w-5 h-5 text-slate-400" />
              Cek Coverage
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-8 border-t border-[#334155]/50 w-full max-w-2xl">
            {[
              { text: '5.000+ Pelanggan Aktif' },
              { text: '99.9% Uptime SLA' },
              { text: 'Support 24/7' }
            ].map((metric, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{metric.text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-slate-500 animate-bounce">
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
}
