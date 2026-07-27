'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Wifi, Tv, Home, Building2, Users, Handshake, FileText, HelpCircle, MapPin, BookOpen, ChevronRight } from 'lucide-react';

const NAV_MENU = [
  {
    label: 'Layanan',
    items: [
      { href: '/layanan/internet-broadband', label: 'Internet Broadband', desc: 'Fiber optik rumah super cepat', icon: Wifi, color: 'text-blue-400' },
      { href: '/layanan/dedicated-internet', label: 'Dedicated Internet', desc: 'SLA 99.9% untuk bisnis', icon: Building2, color: 'text-violet-400' },
      { href: '/layanan/iptv', label: 'IPTV Service', desc: 'Streaming & TV HD terlengkap', icon: Tv, color: 'text-emerald-400' },
      { href: '/layanan/smart-home', label: 'Smart Home', desc: 'Ekosistem rumah pintar IoT', icon: Home, color: 'text-amber-400' },
    ],
  },
  {
    label: 'Perusahaan',
    items: [
      { href: '/perusahaan/tentang-kami', label: 'Tentang Kami', desc: 'Misi, visi & nilai perusahaan', icon: Users, color: 'text-blue-400' },
      { href: '/perusahaan/karir', label: 'Karir', desc: 'Bergabung bersama tim kami', icon: ChevronRight, color: 'text-violet-400' },
      { href: '/perusahaan/mitra-partner', label: 'Mitra & Partner', desc: 'Program kemitraan resmi', icon: Handshake, color: 'text-emerald-400' },
      { href: '/perusahaan/legal-privacy', label: 'Legal & Privacy', desc: 'Kebijakan & ketentuan layanan', icon: FileText, color: 'text-slate-400' },
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleSection = (label) => {
    setOpenSection(prev => (prev === label ? null : label));
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[64px] transition-all duration-300 flex items-center ${
          scrolled
            ? 'bg-[#0b1120]/90 backdrop-blur-xl border-b border-[#334155] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="page-container w-full flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-blue-500/40 group-hover:border-blue-400 transition-colors flex-shrink-0 bg-white">
              <Image
                src="/logo-tcu.jpg"
                alt="PT Top Class Universal"
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-outfit font-black text-[15px] tracking-wide text-white hidden sm:block">
                TOP CLASS UNIVERSAL
              </span>
              <span className="font-outfit font-black text-[15px] tracking-wide text-white sm:hidden">
                TCU
              </span>
              <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-[0.15em] hidden sm:block">
                PT Top Class Universal
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              Beranda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
            </Link>

            {NAV_MENU.map((section) => (
              <div key={section.label} className="relative group cursor-pointer">
                <div className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
                  {section.label}
                  <ChevronDown size={13} className="group-hover:rotate-180 transition-transform duration-200" />
                </div>
                {/* Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-[#334155] rounded-2xl p-2 shadow-2xl shadow-black/60 min-w-[240px]">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1e293b] transition-colors group/item"
                        >
                          <div className={`mt-0.5 ${item.color} opacity-80 group-hover/item:opacity-100 transition-opacity flex-shrink-0`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200 group-hover/item:text-white transition-colors">{item.label}</p>
                            <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            <Link href="/coverage" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              Cek Jangkauan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full" />
            </Link>

            <Link href="/faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
            </Link>

            <Link href="/blog" className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden md:flex h-9 px-4 items-center justify-center rounded-full border border-[#334155] text-slate-300 text-xs font-semibold hover:bg-[#1e293b] hover:text-white transition-all"
            >
              Portal Klien
            </Link>
            <Link
              href="/login?type=staff"
              className="hidden md:flex h-9 px-4 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:scale-105 transition-all"
            >
              Portal Karyawan
            </Link>

            <button
              className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Mobile Drawer (Right Sidebar) ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[340px] bg-[#0a0f1e] border-l border-[#1e2d45] z-[70] transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d45] bg-[#0b1120] flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500/50 bg-white flex-shrink-0">
              <Image
                src="/logo-tcu.jpg"
                alt="PT Top Class Universal"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-outfit font-black text-[13px] tracking-wide text-white">TOP CLASS UNIVERSAL</span>
              <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-widest">PT Top Class Universal</span>
            </div>
          </Link>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1e293b] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto py-3">

          {/* Beranda */}
          <div className="px-3 mb-1">
            <Link
              href="/"
              className="flex items-center h-12 px-4 text-slate-200 font-semibold text-sm rounded-xl hover:bg-[#1e293b] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </Link>
          </div>

          <div className="h-px bg-[#1e2d45] mx-5 my-2" />

          {/* Accordion Sections */}
          {NAV_MENU.map((section) => (
            <div key={section.label} className="px-3 mb-1">
              {/* Section Toggle */}
              <button
                className="w-full flex items-center justify-between h-11 px-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors rounded-xl hover:bg-[#1e293b]/50"
                onClick={() => toggleSection(section.label)}
              >
                <span>{section.label}</span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${openSection === section.label ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Section Items */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openSection === section.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-2 pb-2 space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1e293b] transition-colors group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon size={16} className={`${item.color} flex-shrink-0`} />
                        <div>
                          <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors leading-none mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className="h-px bg-[#1e2d45] mx-5 my-2" />

          {/* Standalone Links */}
          <div className="px-3 space-y-0.5">
            <Link
              href="/coverage"
              className="flex items-center h-12 px-4 text-slate-300 text-sm font-medium rounded-xl hover:bg-[#1e293b] hover:text-white transition-colors gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MapPin size={16} className="text-emerald-400" />
              Cek Jangkauan
            </Link>
            <Link
              href="/faq"
              className="flex items-center h-12 px-4 text-slate-300 text-sm font-medium rounded-xl hover:bg-[#1e293b] hover:text-white transition-colors gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HelpCircle size={16} className="text-blue-400" />
              FAQ
            </Link>
            <Link
              href="/blog"
              className="flex items-center h-12 px-4 text-slate-300 text-sm font-medium rounded-xl hover:bg-[#1e293b] hover:text-white transition-colors gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen size={16} className="text-amber-400" />
              Blog
            </Link>
          </div>
        </div>

        {/* Drawer Footer — CTA Buttons */}
        <div className="p-4 border-t border-[#1e2d45] bg-[#0b1120] flex flex-col gap-2.5 flex-shrink-0">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-[#334155] text-slate-200 font-semibold text-sm hover:bg-[#1e293b] hover:text-white transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Portal Klien
          </Link>
          <Link
            href="/login?type=staff"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.01] transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Portal Karyawan
          </Link>
          <p className="text-center text-[10px] text-slate-600 mt-0.5">
            © 2026 PT Top Class Universal
          </p>
        </div>
      </div>
    </>
  );
}
