import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  layanan: [
    { href: '/layanan/internet-broadband', label: 'Internet Broadband' },
    { href: '/layanan/dedicated-internet', label: 'Dedicated Internet' },
    { href: '/layanan/iptv', label: 'IPTV Service' },
    { href: '/layanan/smart-home', label: 'Smart Home' },
  ],
  perusahaan: [
    { href: '/perusahaan/tentang-kami', label: 'Tentang Kami' },
    { href: '/perusahaan/karir', label: 'Karir' },
    { href: '/perusahaan/mitra-partner', label: 'Mitra & Partner' },
    { href: '/perusahaan/legal-privacy', label: 'Legal & Privacy' },
  ],
  bantuan: [
    { href: '/faq', label: 'FAQ' },
    { href: '/coverage', label: 'Cek Jangkauan' },
    { href: '/blog', label: 'Blog' },
  ],
};

// Inline SVG social icons (avoid lucide version mismatch)
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
);
const IconTwitterX = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const SOCIALS = [
  { href: '#', Icon: IconInstagram, label: 'Instagram' },
  { href: '#', Icon: IconFacebook, label: 'Facebook' },
  { href: '#', Icon: IconYoutube, label: 'Youtube' },
  { href: '#', Icon: IconTwitterX, label: 'Twitter / X' },
];

export default function Footer() {
  return (
    <footer className="bg-[#060d1a] border-t border-[#0f1e35]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Col 1 — Brand (wider) */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/40 bg-white flex-shrink-0">
                <Image
                  src="/logo-tcu.jpg"
                  alt="PT Top Class Universal"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-outfit font-black text-base tracking-wide text-white">TOP CLASS UNIVERSAL</span>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-[0.12em]">PT Top Class Universal</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Penyedia layanan Internet Fiber Optik, IPTV, dan Smart Home super cepat, andal, dan terpercaya untuk rumah & bisnis di seluruh Jawa Barat.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              <a href="tel:08001TCU" className="flex items-center gap-2.5 text-slate-400 hover:text-white text-sm transition-colors group">
                <Phone size={14} className="text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                0800-1-TCU (24/7 Bebas Pulsa)
              </a>
              <a href="mailto:cs@topclassuniversal.co.id" className="flex items-center gap-2.5 text-slate-400 hover:text-white text-sm transition-colors group">
                <Mail size={14} className="text-blue-400 group-hover:text-blue-300 flex-shrink-0" />
                cs@topclassuniversal.co.id
              </a>
              <div className="flex items-start gap-2.5 text-slate-400 text-sm">
                <MapPin size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                Pangandaran, Banjar, Ciamis, Tasikmalaya, Indramayu
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Layanan */}
          <div>
            <h4 className="text-[0.65rem] uppercase tracking-widest text-slate-500 font-bold mb-5">Layanan</h4>
            <ul className="space-y-3.5">
              {FOOTER_LINKS.layanan.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors relative group flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-500/60 group-hover:bg-blue-400 flex-shrink-0 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Perusahaan */}
          <div>
            <h4 className="text-[0.65rem] uppercase tracking-widest text-slate-500 font-bold mb-5">Perusahaan</h4>
            <ul className="space-y-3.5">
              {FOOTER_LINKS.perusahaan.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors relative group flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-violet-500/60 group-hover:bg-violet-400 flex-shrink-0 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Bantuan */}
          <div>
            <h4 className="text-[0.65rem] uppercase tracking-widest text-slate-500 font-bold mb-5">Bantuan</h4>
            <ul className="space-y-3.5 mb-6">
              {FOOTER_LINKS.bantuan.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors relative group flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500/60 group-hover:bg-emerald-400 flex-shrink-0 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-emerald-600/10 text-emerald-400 font-semibold text-xs border border-emerald-500/25 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all w-full sm:w-auto"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.12 1.525 5.855L0 24l6.335-1.525A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.012-1.373l-.36-.214-3.738.98.996-3.647-.234-.374A9.795 9.795 0 012.182 12c0-5.413 4.404-9.818 9.818-9.818 5.413 0 9.818 4.405 9.818 9.818 0 5.413-4.405 9.818-9.818 9.818z" />
              </svg>
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#0f1e35] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs text-center sm:text-left">
            &copy; {new Date().getFullYear()} PT Top Class Universal. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/perusahaan/legal-privacy" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Privacy Policy</Link>
            <span className="text-slate-700 text-xs">·</span>
            <Link href="/perusahaan/legal-privacy" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Terms of Service</Link>
            <span className="text-slate-700 text-xs">·</span>
            <Link href="/sitemap.xml" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
