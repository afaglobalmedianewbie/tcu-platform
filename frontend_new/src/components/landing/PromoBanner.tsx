'use client';

import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';

const promos = [
  {
    id: 1,
    title: 'Diskon Instalasi 50%',
    desc: 'Khusus pelanggan baru di area Pangandaran & Banjar bulan ini.',
    discount: '50%',
    gradient: 'from-violet-600/20 to-blue-600/10',
    borderHover: 'hover:border-violet-500/50'
  },
  {
    id: 2,
    title: 'Gratis Bulan Ke-12',
    desc: 'Bayar 11 bulan di muka, dapatkan gratis internet untuk bulan ke-12.',
    discount: '1BLN',
    gradient: 'from-emerald-600/20 to-blue-600/10',
    borderHover: 'hover:border-emerald-500/50'
  }
];

export default function PromoBanner() {
  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-gradient-to-b from-[#0b1120] to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider uppercase text-sm mb-3">
            <Tag className="w-4 h-4" />
            Promo Spesial
          </span>
          <h2 className="text-[1.75rem] sm:text-4xl font-black font-['Outfit'] text-slate-100">
            Penawaran Terbatas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto mb-8">
          {promos.map((promo) => (
            <div 
              key={promo.id}
              className={`relative bg-gradient-to-br ${promo.gradient} backdrop-blur-md border border-[#334155] rounded-2xl p-6 min-h-[200px] flex flex-col transition-all duration-300 ${promo.borderHover} hover:shadow-lg hover:shadow-black/20 group`}
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <span className="font-black text-white text-sm">{promo.discount}</span>
              </div>
              
              <div className="mt-auto pt-10">
                <h3 className="font-bold font-['Outfit'] text-lg text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {promo.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {promo.desc}
                </p>
                <Link 
                  href="/promo"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                  Lihat Detail <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/promo"
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-xl border border-[#334155] bg-[#1e293b]/50 hover:bg-[#1e293b] text-sm font-semibold text-slate-200 transition-colors"
          >
            Lihat Semua Promo
          </Link>
        </div>

      </div>
    </section>
  );
}
