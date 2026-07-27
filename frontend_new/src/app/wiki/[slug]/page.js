import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { ArrowLeft, Printer, Share2, Calendar, Layout, FileText, ChevronRight, Home } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WikiDocPage({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/data/wiki.json');
  let docs = [];
  
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      docs = JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Error reading wiki.json', err);
  }

  const doc = docs.find(d => d.slug === slug);
  
  if (!doc) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-300 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-[#1e293b] p-8 rounded-3xl border border-[#334155] shadow-2xl">
          <FileText className="w-16 h-16 text-[#ef4444]/50 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2 font-['Outfit']">Dokumen Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-8">Maaf, dokumentasi yang Anda cari tidak tersedia atau URL tidak valid.</p>
          <Link href="/wiki" className="inline-flex items-center px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl text-white font-medium transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Dokumentasi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-['Inter'] selection:bg-[#2563eb]/30">
      {/* Top Nav */}
      <nav className="border-b border-[#334155] bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 overflow-hidden rounded border border-[#334155] group-hover:border-[#2563eb]/50 transition-colors">
              <Image src="/logo-tcu.jpg" alt="TCU Logo" fill className="object-cover" />
            </div>
            <span className="text-lg font-bold text-white font-['Outfit'] hidden sm:block">TCU Platform</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/wiki" className="text-sm font-medium text-slate-400 hover:text-white flex items-center transition-colors bg-[#1e293b] px-4 py-2 rounded-lg border border-[#334155]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dokumentasi
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="bg-gradient-to-b from-[#1e293b] to-[#0f172a] border-b border-[#334155]/50 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5" /> Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/wiki" className="hover:text-white transition-colors">
              Dokumentasi
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#60a5fa] truncate max-w-[200px] md:max-w-xs">{doc.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 bg-[#2563eb]/10 text-[#60a5fa] text-sm font-bold rounded-md border border-[#2563eb]/20 mb-6 uppercase tracking-wider">
            {doc.category || 'Dokumentasi'}
          </span>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-['Outfit'] mb-6 leading-tight">
            {doc.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2 bg-[#1e293b] px-3 py-1.5 rounded-md border border-[#334155]">
              <Calendar className="w-4 h-4 text-[#10b981]" />
              <span>Diperbarui: {new Date(doc.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1e293b] px-3 py-1.5 rounded-md border border-[#334155]">
              <Layout className="w-4 h-4 text-[#f59e0b]" />
              <span>{doc.author || 'Sistem Autopost'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Actions Bar */}
        <div className="flex items-center justify-end gap-3 mb-10 pb-6 border-b border-[#334155]">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-[#1e293b] hover:bg-[#334155] border border-[#334155] rounded-md transition-colors">
            <Printer className="w-4 h-4" /> Cetak
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white bg-[#1e293b] hover:bg-[#334155] border border-[#334155] rounded-md transition-colors">
            <Share2 className="w-4 h-4" /> Bagikan
          </button>
        </div>

        {/* Content Body */}
        <article className="bg-[#1e293b]/30 border border-[#334155]/50 rounded-3xl p-6 md:p-10 shadow-xl">
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-['Outfit'] prose-headings:text-white prose-headings:font-bold prose-headings:border-b prose-headings:border-[#334155] prose-headings:pb-2
            prose-a:text-[#60a5fa] hover:prose-a:text-[#93c5fd]
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-[#f59e0b] prose-code:bg-[#0f172a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-[#334155]
            prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-[#334155] prose-pre:shadow-inner
            prose-img:rounded-xl prose-img:border prose-img:border-[#334155] prose-img:shadow-lg
            prose-table:border-collapse prose-td:border prose-td:border-[#334155] prose-th:border prose-th:border-[#334155] prose-th:bg-[#1e293b]
            prose-blockquote:border-l-[#2563eb] prose-blockquote:bg-[#2563eb]/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </article>
        
        {/* Footer Nav */}
        <div className="mt-16 flex items-center justify-between pt-8 border-t border-[#334155]">
          <Link href="/wiki" className="inline-flex items-center px-5 py-2.5 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] rounded-xl text-white font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Link>
          <div className="text-sm text-slate-500 font-medium">
            TCU Documentation System
          </div>
        </div>
      </div>
    </div>
  );
}
