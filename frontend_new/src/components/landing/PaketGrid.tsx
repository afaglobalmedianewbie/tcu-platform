'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'home-lite',
    name: 'Home Lite',
    speed: '30 Mbps',
    price: '155.000',
    popular: false,
    features: [
      'Unlimited No FUP',
      'Uptime 99.9%',
      'ONT WiFi Gratis'
    ]
  },
  {
    id: 'home-premium',
    name: 'Home Premium',
    speed: '50 Mbps',
    price: '299.000',
    popular: true,
    features: [
      'Unlimited No FUP',
      'Uptime 99.9%',
      'ONT WiFi Premium',
      'Priority Traffic'
    ]
  },
  {
    id: 'business-pro',
    name: 'Business Pro',
    speed: '100 Mbps',
    price: '699.000',
    popular: false,
    features: [
      'Unlimited No FUP',
      'Uptime 99.95%',
      'IP Publik Dinamis',
      'SLA Support 24/7'
    ]
  }
];

interface PaketGridProps {
  plansData?: any[];
}

export default function PaketGrid({ plansData }: PaketGridProps) {
  const displayPlans = (plansData && plansData.length > 0) ? plansData.map(p => ({
    id: p.id || p.name.toLowerCase().replace(/\s+/g, '-'),
    name: p.name,
    speed: `${p.speed_mbps || p.speed || 30} Mbps`,
    price: typeof p.price === 'number' ? p.price.toLocaleString('id-ID') : p.price,
    popular: Boolean(p.popular),
    features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? p.features.split(',').map((f: string) => f.trim()) : ['Unlimited No FUP', 'Uptime 99.9%', 'ONT WiFi Gratis'])
  })) : plans;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#0b1120]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-violet-400 font-semibold tracking-wider uppercase text-sm mb-3 block">Paket Internet</span>
          <h2 className="text-[1.75rem] sm:text-4xl font-black font-['Outfit'] text-slate-100 mb-4">
            Pilih Paket Sesuai Kebutuhanmu
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-['Inter']">
            Harga jujur tanpa biaya tersembunyi. Semua paket sudah termasuk unlimited kuota tanpa FUP dan perangkat ONT WiFi.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {displayPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative group bg-[#1e293b]/80 backdrop-blur-md border ${plan.popular ? 'border-violet-500 ring-1 ring-violet-500/50' : 'border-[#334155]'} rounded-2xl p-6 sm:p-8 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:shadow-xl ${plan.popular ? 'hover:shadow-violet-500/20' : 'hover:shadow-slate-900/50'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  TERPOPULER
                </div>
              )}
              
              <div className="inline-flex items-center self-start bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {plan.speed}
              </div>
              
              <h3 className="font-black font-['Outfit'] text-xl sm:text-2xl text-slate-100">
                {plan.name}
              </h3>
              
              <div className="w-full h-px bg-[#334155] my-5" />
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-sm font-semibold text-slate-300">Rp</span>
                <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-400 font-medium">/bulan</span>
              </div>
              
              <ul className="flex flex-col gap-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={`/register?plan=${plan.id}`}
                className={`w-full min-h-[48px] flex items-center justify-center rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40' 
                    : 'bg-[#0f172a]/50 hover:bg-[#0f172a] border border-[#334155] text-white'
                }`}
              >
                Pilih {plan.name}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
