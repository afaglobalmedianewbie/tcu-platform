'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Umum',
    items: [
      { q: 'Apa itu Top Class Universal?', a: 'Top Class Universal adalah penyedia layanan internet (ISP) berbasis 100% Fiber Optic (FTTH) yang menawarkan koneksi super cepat dan stabil.' },
      { q: 'Bagaimana cara berlangganan?', a: 'Anda dapat berlangganan dengan mengisi form pendaftaran di website kami atau menghubungi tim sales melalui WhatsApp.' }
    ]
  },
  {
    category: 'Teknis',
    items: [
      { q: 'Berapa kecepatan upload & download?', a: 'Kami menerapkan kebijakan rasio simetris 1:1 atau asimetris terbaik di kelasnya tergantung paket yang Anda pilih, memastikan pengalaman upload sama cepatnya dengan download.' },
      { q: 'Apakah ada batasan kuota (FUP)?', a: 'Tidak, semua paket kami 100% Unlimited tanpa FUP (Fair Usage Policy).' }
    ]
  },
  {
    category: 'Billing',
    items: [
      { q: 'Bagaimana cara pembayaran tagihan?', a: 'Pembayaran dapat dilakukan melalui transfer bank (Virtual Account), e-wallet (OVO, GoPay, Dana), atau minimarket terdekat.' },
      { q: 'Kapan tanggal jatuh tempo?', a: 'Tanggal jatuh tempo tagihan biasanya sesuai dengan tanggal aktifasi layanan Anda setiap bulannya.' }
    ]
  }
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('Umum');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFaqs = faqs.find(f => f.category === activeCategory)?.items || [];
  
  const filteredFaqs = searchQuery
    ? faqs.flatMap(f => f.items).filter(item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentFaqs;

  return (
    <main className="min-h-screen bg-[#0b1120] pt-24 md:pt-28 pb-14 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 mb-6">
            <HelpCircle className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-[2.2rem] sm:text-4xl lg:text-5xl font-black font-['Outfit'] text-slate-100 mb-4">
            Pusat Bantuan & FAQ
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-['Inter']">
            Temukan jawaban untuk pertanyaan umum seputar layanan kami.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[52px] bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] text-slate-200 placeholder:text-slate-500 rounded-xl pl-12 pr-4 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
        </div>

        {/* Categories (hidden when searching) */}
        {!searchQuery && (
          <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
            {faqs.map(cat => (
              <button
                key={cat.category}
                onClick={() => { setActiveCategory(cat.category); setOpenIndex(null); }}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.category 
                    ? 'bg-violet-600 text-white border border-violet-500 shadow-md shadow-violet-500/20' 
                    : 'bg-[#1e293b]/50 border border-[#334155] text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-3">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-[#1e293b]/60 backdrop-blur-md border border-[#334155] rounded-xl overflow-hidden transition-colors hover:border-[#475569]"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
              >
                <span className="font-semibold text-slate-200 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="p-4 sm:p-5 pt-0 text-slate-400 text-sm leading-relaxed border-t border-[#334155]/50">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              Tidak ada hasil yang ditemukan untuk "{searchQuery}"
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#334155] rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-200 mb-2">Masih Butuh Bantuan?</h3>
          <p className="text-sm text-slate-400 mb-6">Tim support kami siap membantu Anda 24/7.</p>
          <button className="min-h-[44px] px-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-violet-500/20">
            Hubungi WhatsApp Support
          </button>
        </div>

      </div>
    </main>
  );
}
