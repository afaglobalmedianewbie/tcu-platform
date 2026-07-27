'use client';
import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0E1A2B] text-slate-100 flex flex-col font-sans">
      <nav className="h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚡</span>
          <span className="font-extrabold text-base tracking-tight text-slate-200">
            TCU <span className="text-[#7B4DFF]">Platform</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition duration-200"
          >
            ← Portal Admin
          </Link>
        </div>
      </nav>
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
