import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }) {
  const { slug } = params;
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

  const post = posts.find(p => p.slug === slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-300 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-[#1e293b]/80 p-8 rounded-3xl border border-[#334155] backdrop-blur-md">
          <h1 className="text-6xl font-bold text-[#7c3aed] mb-4 font-['Outfit']">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Artikel Tidak Ditemukan</h2>
          <p className="text-slate-400 mb-8">Maaf, artikel yang Anda cari mungkin telah dihapus atau URL tidak valid.</p>
          <Link href="/blog" className="inline-flex items-center px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-xl text-white font-medium transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali ke Blog
          </Link>
        </div>
      </div>
    );
  }

  // Calculate reading time
  const wordCount = (post.content || '').replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get related posts (next 3)
  const relatedPosts = posts.filter(p => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-300 font-['Inter'] selection:bg-[#7c3aed]/30">
      {/* Header */}
      <header className="relative bg-[#0f172a] pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-[#334155]/50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7c3aed]/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10b981]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/blog" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Semua Artikel
          </Link>

          <div className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 bg-[#10b981]/10 text-[#10b981] text-sm font-semibold rounded-full border border-[#10b981]/20 mb-6">
              {post.category || 'Teknologi'}
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-['Outfit'] mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#7c3aed]" />
                <span className="font-medium text-slate-300">{post.author || 'Tim TCU'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#10b981]" />
                <span>{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#f59e0b]" />
                <span>{readingTime} menit baca</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article Body */}
          <article className="lg:w-2/3">
            <div className="prose prose-invert prose-lg max-w-none
              prose-headings:font-['Outfit'] prose-headings:text-white prose-headings:font-bold
              prose-a:text-[#7c3aed] hover:prose-a:text-[#9355ea]
              prose-strong:text-white prose-strong:font-semibold
              prose-code:text-[#10b981] prose-code:bg-[#1e293b] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-[#1e293b] prose-pre:border prose-pre:border-[#334155]
              prose-img:rounded-2xl prose-img:border prose-img:border-[#334155]
              prose-blockquote:border-l-[#7c3aed] prose-blockquote:bg-[#1e293b]/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Share Bottom */}
            <div className="mt-16 pt-8 border-t border-[#334155] flex items-center justify-between">
              <span className="text-white font-medium">Bagikan artikel ini:</span>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-slate-400 hover:bg-[#1da1f2]/10 hover:text-[#1da1f2] hover:border-[#1da1f2]/50 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-slate-400 hover:bg-[#1877f2]/10 hover:text-[#1877f2] hover:border-[#1877f2]/50 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-slate-400 hover:bg-[#0a66c2]/10 hover:text-[#0a66c2] hover:border-[#0a66c2]/50 transition-all">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 bg-[#1e293b]/60 border border-[#334155] rounded-3xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white font-['Outfit'] mb-6 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#7c3aed]" />
                Artikel Terkait
              </h3>
              
              <div className="space-y-6">
                {relatedPosts.length > 0 ? relatedPosts.map((rp) => (
                  <Link href={`/blog/${rp.slug}`} key={rp.slug} className="block group">
                    <div className="text-xs text-[#10b981] font-medium mb-1">
                      {rp.category || 'Teknologi'}
                    </div>
                    <h4 className="text-base font-semibold text-slate-200 group-hover:text-[#7c3aed] transition-colors line-clamp-2 leading-snug mb-2 font-['Outfit']">
                      {rp.title}
                    </h4>
                    <div className="text-xs text-slate-500">
                      {new Date(rp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </Link>
                )) : (
                  <p className="text-slate-400 text-sm">Tidak ada artikel terkait.</p>
                )}
              </div>
              
              <div className="mt-8 pt-8 border-t border-[#334155]">
                <div className="bg-gradient-to-br from-[#7c3aed]/20 to-[#2563eb]/20 p-6 rounded-2xl border border-[#7c3aed]/30 text-center">
                  <h4 className="text-white font-bold font-['Outfit'] mb-2">Berlangganan Newsletter</h4>
                  <p className="text-xs text-slate-400 mb-4">Dapatkan info terbaru langsung ke inbox Anda.</p>
                  <div className="flex flex-col gap-2">
                    <input type="email" placeholder="Email Anda" className="w-full px-3 py-2 bg-[#0f172a] border border-[#334155] rounded-lg text-sm text-white focus:outline-none focus:border-[#7c3aed]" />
                    <button className="w-full py-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-medium rounded-lg transition-colors">
                      Daftar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
