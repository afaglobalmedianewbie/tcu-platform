import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { Search, Book, FileText, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WikiPage() {
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

  const displayDocs = [...docs].reverse();
  const categories = ['Semua', 'Release Notes', 'User Guide', 'Admin Manual'];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-['Inter'] selection:bg-[#2563eb]/30">
      {/* Header */}
      <header className="relative bg-[#0f172a] overflow-hidden border-b border-[#334155]/50 pb-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2563eb]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#10b981]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        {/* Nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-[#334155] shadow-lg shadow-[#2563eb]/20 group-hover:border-[#2563eb]/50 transition-colors">
              <Image src="/logo-tcu.jpg" alt="TCU Logo" fill className="object-cover" />
            </div>
            <span className="text-xl font-bold text-white font-['Outfit'] tracking-wide">TCU</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white flex items-center transition-colors bg-[#1e293b]/50 px-4 py-2 rounded-full border border-[#334155]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Beranda Platform
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2563eb]/10 border border-[#2563eb]/20 rounded-full mb-6 text-[#60a5fa] text-xs font-semibold tracking-wide uppercase">
            <Zap className="w-3 h-3" />
            Autopost Enabled
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-['Outfit'] mb-6 tracking-tight">
            Pusat <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#7c3aed]">Dokumentasi</span> TCU
          </h1>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Dokumentasi teknis, catatan rilis, dan panduan resmi platform Top Class Universal. Diperbarui secara otomatis pada setiap perubahan sistem.
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Search & Filter */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto relative mb-8 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-[#2563eb] transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Cari dokumentasi, panduan, atau catatan rilis..." 
              className="w-full pl-12 pr-4 py-4 bg-[#1e293b]/80 border border-[#334155] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent backdrop-blur-sm transition-all shadow-lg"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${idx === 0 ? 'bg-[#2563eb]/20 text-[#60a5fa] border-[#2563eb]/50' : 'bg-[#1e293b]/50 text-slate-400 border-[#334155] hover:bg-[#1e293b] hover:text-white hover:border-slate-500'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Docs List */}
        {displayDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {displayDocs.map(doc => {
              const excerpt = doc.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) || 'Baca selengkapnya di dokumentasi resmi TCU...';
              
              // Determine category colors
              let catColor = "text-[#60a5fa] bg-[#2563eb]/10 border-[#2563eb]/20";
              if (doc.category === 'Release Notes') catColor = "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20";
              if (doc.category === 'Admin Manual') catColor = "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20";
              if (doc.category === 'User Guide') catColor = "text-[#7c3aed] bg-[#7c3aed]/10 border-[#7c3aed]/20";

              return (
                <Link href={`/wiki/${doc.slug}`} key={doc.slug} className="block group">
                  <div className="bg-[#1e293b]/40 border border-[#334155] rounded-2xl p-6 md:p-8 hover:bg-[#1e293b]/80 hover:border-[#2563eb]/50 transition-all duration-300 backdrop-blur-sm h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                      <FileText className="w-24 h-24 text-white" />
                    </div>
                    
                    <div className="relative z-10 flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-md border ${catColor}`}>
                          {doc.category || 'Dokumentasi'}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center">
                          {new Date(doc.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-[#60a5fa] transition-colors leading-tight">
                        {doc.title}
                      </h2>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                        {excerpt}
                      </p>
                    </div>
                    
                    <div className="relative z-10 mt-auto pt-4 border-t border-[#334155]/50 flex items-center text-[#60a5fa] text-sm font-medium group-hover:text-[#93c5fd]">
                      Lihat Dokumentasi <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-[#1e293b]/20 rounded-3xl border border-[#334155]/30 border-dashed">
            <div className="w-20 h-20 bg-[#2563eb]/10 rounded-2xl flex items-center justify-center mb-6 rotate-3">
              <Book className="w-10 h-10 text-[#2563eb]/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 font-['Outfit']">Dokumentasi Kosong</h3>
            <p className="text-slate-400 text-center max-w-md">Belum ada dokumentasi atau catatan rilis yang tersedia di sistem saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
