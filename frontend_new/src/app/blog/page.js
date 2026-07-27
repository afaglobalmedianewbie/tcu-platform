import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { Search, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const filePath = path.join(process.cwd(), 'src/data/posts.json');
  let posts = [];
  
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      posts = JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Error reading posts.json', err);
  }

  const displayPosts = [...posts].reverse();
  const categories = ['Semua', 'Teknologi', 'Tutorial', 'Promo', 'Rilis'];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-['Inter'] selection:bg-[#7c3aed]/30">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7c3aed]/10 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
          
          <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-['Outfit'] mb-6 tracking-tight">
              Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#10b981]">Berita</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400">
              Wawasan terbaru seputar teknologi jaringan dan digitalisasi
            </p>
          </div>
          
          {/* Search & Filter */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-96 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input 
                type="text" 
                placeholder="Cari artikel..." 
                className="w-full pl-10 pr-4 py-3 bg-[#1e293b]/80 border border-[#334155] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent backdrop-blur-sm transition-all"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full">
              {categories.map((cat, idx) => (
                <button 
                  key={idx} 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${idx === 0 ? 'bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/50' : 'bg-[#1e293b]/50 text-slate-400 border-[#334155] hover:bg-[#1e293b] hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* Blog Grid */}
          {displayPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayPosts.map(post => {
                const excerpt = post.content?.replace(/<[^>]*>?/gm, '').substring(0, 120) || 'Baca artikel selengkapnya di blog TCU...';
                return (
                  <article key={post.slug} className="bg-[#1e293b]/60 border border-[#334155] rounded-2xl overflow-hidden hover:border-[#7c3aed]/50 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.2)] transition-all duration-300 backdrop-blur-sm flex flex-col h-full group">
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-[#10b981]/10 text-[#10b981] text-xs font-semibold rounded-full border border-[#10b981]/20">
                          {post.category || 'Teknologi'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-xl font-bold text-white mb-3 font-['Outfit'] group-hover:text-[#7c3aed] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                      
                      <p className="text-sm text-slate-400 mb-6 flex-grow line-clamp-3">
                        {excerpt}...
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-[#334155]/50 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-300">
                          Oleh: {post.author || 'Admin'}
                        </span>
                        <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-[#7c3aed] hover:text-[#9355ea] flex items-center transition-colors">
                          Baca <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center bg-[#1e293b]/30 rounded-3xl border border-[#334155]/50 border-dashed">
              <div className="w-20 h-20 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-10 h-10 text-[#7c3aed]/50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-['Outfit']">Belum ada artikel</h3>
              <p className="text-slate-400 text-center max-w-md">Kami sedang menyiapkan konten-konten menarik untuk Anda. Silakan kembali lagi nanti.</p>
            </div>
          )}
          
          <div className="mt-16 flex justify-center border-t border-[#334155]/50 pt-8 pb-12">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-[#1e293b] hover:bg-[#334155] border border-[#334155] rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-[#7c3aed]/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
