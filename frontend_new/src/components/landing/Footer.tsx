'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-16 border-t border-slate-900 text-slate-500 font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="space-y-4 sm:col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500/40 bg-white flex-shrink-0">
              <Image src="/logo-tcu.jpg" alt="PT Top Class Universal" fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-outfit font-black text-sm tracking-wide text-slate-200">TOP CLASS UNIVERSAL</span>
              <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-widest">PT Top Class Universal</span>
            </div>
          </Link>
          <p className="text-xs md:text-sm leading-relaxed text-slate-400">
            Penyedia layanan internet fiber optic handal dan terpercaya untuk segmentasi retail rumahan maupun enterprise korporat.
          </p>
        </div>

        {/* Links: Services */}
        <div>
          <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-4">Layanan</h4>
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-400">
            <li><Link href="/layanan/internet-broadband" className="hover:text-white transition">Internet Broadband</Link></li>
            <li><Link href="/layanan/dedicated-internet" className="hover:text-white transition">Dedicated Internet</Link></li>
            <li><Link href="/layanan/iptv" className="hover:text-white transition">IPTV Service</Link></li>
            <li><Link href="/layanan/smart-home" className="hover:text-white transition">Smart Home</Link></li>
          </ul>
        </div>

        {/* Links: Corporate */}
        <div>
          <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-4">Perusahaan</h4>
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-400">
            <li><Link href="/perusahaan/tentang-kami" className="hover:text-white transition">Tentang Kami</Link></li>
            <li><Link href="/perusahaan/karir" className="hover:text-white transition">Karir</Link></li>
            <li><Link href="/perusahaan/mitra-partner" className="hover:text-white transition">Mitra &amp; Partner</Link></li>
            <li><Link href="/perusahaan/legal-privacy" className="hover:text-white transition">Legal &amp; Privacy</Link></li>
          </ul>
        </div>

        {/* Links: Support */}
        <div>
          <h4 className="text-slate-300 font-bold text-xs uppercase tracking-wider mb-4">Bantuan</h4>
          <ul className="space-y-2.5 text-xs md:text-sm text-slate-400">
            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link href="/coverage" className="hover:text-white transition">Cek Jangkauan</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-6xl mx-auto px-6 border-t border-slate-900 mt-12 pt-8 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
        © {new Date().getFullYear()} PT Top Class Universal. All Rights Reserved.
      </div>
    </footer>
  );
}
