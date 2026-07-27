'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send, Bot, User, ChevronDown, Wifi, Phone, FileQuestion, MapPin } from 'lucide-react';

const QUICK_REPLIES = [
  { id: 'paket', label: '📦 Info Paket Internet', text: 'Saya ingin tahu informasi paket internet yang tersedia.' },
  { id: 'coverage', label: '📍 Cek Jangkauan', text: 'Bagaimana cara cek jangkauan internet TCU di area saya?' },
  { id: 'gangguan', label: '🔧 Laporkan Gangguan', text: 'Saya ingin melaporkan gangguan internet.' },
  { id: 'kontak', label: '📞 Hubungi CS', text: 'Saya ingin berbicara dengan customer service.' },
];

const BOT_RESPONSES = {
  paket: `Selamat Datang di PT Top Class Universal! 🚀\n\nKami menyediakan layanan internet 100% Fiber Optic (FTTH):\n\n📦 **Home Lite 30 Mbps** — Rp 155.000/bulan (Unlimited No FUP)\n⭐️ **Home Premium 50 Mbps** — Rp 299.000/bulan (Priority Traffic + ONT Dualband)\n🏢 **Business Pro 100 Mbps** — Rp 699.000/bulan (SLA 99.95% + IP Publik)\n\nSemua paket sudah termasuk GRATIS sewa modem ONT & Bebas FUP!`,
  coverage: `📍 **Area Jangkauan Resmi PT Top Class Universal:**\n\nJaringan Fiber Optic kami kini beroperasi penuh di:\n• **Pangandaran** (Kec. Padaherang, Kalipucang, Sidamulih, dll)\n• **Banjar** & **Ciamis** (Mangunjaya, Padaherang Core)\n• **Tasikmalaya** & **Indramayu**\n\nUntuk cek ketersediaan tiang ODP tepat di depan rumah Anda, silakan hubungi tim survei via WhatsApp CS di **0823-1914-0858**!`,
  gangguan: `🔧 **Laporan Gangguan & Technical Support 24/7:**\n\nJika mengalami kendala lampu LOS merah atau koneksi lambat:\n1️⃣ Coba **Restart Modem ONT** Anda selama 30 detik.\n2️⃣ Buka **Portal Klien** di dasbor dan klik **Tiket Gangguan**.\n3️⃣ Atau langsung WhatsApp Customer Support ke **0823-1914-0858** dengan menyebutkan ID Pelanggan (misal: TCU-XXXX).\n\nTim NOC & Teknisi Lapangan kami akan segera meluncur ke lokasi Anda!`,
  kontak: `🏢 **PT TOP CLASS UNIVERSAL**\n*High-Speed Fiber Optic Infrastructure*\n\n📞 **Hotline CS / WA**: 0823-1914-0858 / 0800-1-TCU\n📧 **Email Resmi**: admin@topclassuniversal.co.id / cs@topclassuniversal.co.id\n🌐 **Portal Web**: topclass.id / topclassuniversal.co.id\n📍 **Kantor Pusat**: Jl. Padaherang Core No. 1, Pangandaran, Jawa Barat\n🕐 **Jam Operasional NOC & CS**: 24 Jam Nonstop (Senin - Minggu)`,
  default: `Halo! Saya **AI Assistant PT Top Class Universal** 🤖\n\nAda yang bisa saya bantu terkait layanan Fiber Optic kami hari ini?\n\n• **Info Paket & Promo Terbaru**\n• **Cek Jangkauan Area (ODP/FTTH)**\n• **Bantuan Gangguan Teknis (24/7)**\n• **Cara Pembayaran & Invoicing**`,
};

function parseMessage(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part.split('\n').map((line, j) => (
      <React.Fragment key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  });
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: BOT_RESPONSES.default, time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing, open]);

  const getBotReply = (userText) => {
    const lower = userText.toLowerCase();
    if (lower.includes('paket') || lower.includes('harga') || lower.includes('internet') || lower.includes('broadband') || lower.includes('dedicated') || lower.includes('30') || lower.includes('50') || lower.includes('100') || lower.includes('promo')) {
      return BOT_RESPONSES.paket;
    }
    if (lower.includes('coverage') || lower.includes('jangkauan') || lower.includes('area') || lower.includes('pangandaran') || lower.includes('banjar') || lower.includes('ciamis') || lower.includes('tasik') || lower.includes('indramayu') || lower.includes('lokasi')) {
      return BOT_RESPONSES.coverage;
    }
    if (lower.includes('gangguan') || lower.includes('los') || lower.includes('merah') || lower.includes('mati') || lower.includes('lambat') || lower.includes('lelet') || lower.includes('putus') || lower.includes('tiket')) {
      return BOT_RESPONSES.gangguan;
    }
    if (lower.includes('cs') || lower.includes('admin') || lower.includes('kontak') || lower.includes('telepon') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('alamat')) {
      return BOT_RESPONSES.kontak;
    }
    return `Terima kasih telah menghubungi PT Top Class Universal! 😊\n\nUntuk pertanyaan mengenai akun, pendaftaran baru, atau bantuan mendesak, Anda dapat langsung menghubungi Customer Support kami:\n\n📞 **Hotline**: 0800-1-TCU\n💬 **WhatsApp**: **0823-1914-0858**\n📧 **Email**: **admin@topclassuniversal.co.id**\n\nTim kami siap membantu Anda 24 jam nonstop!`;
  };

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: Date.now(), from: 'user', text: trimmed, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = getBotReply(trimmed);
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply, time: new Date() }]);
      if (!open) setUnread(u => u + 1);
    }, 1200 + Math.random() * 800);
  };

  const handleQuickReply = (qr) => {
    sendMessage(qr.text);
  };

  const formatTime = (d) => d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-4 sm:right-6 z-[200] w-[calc(100vw-32px)] max-w-[380px] flex flex-col rounded-2xl shadow-2xl border border-[#334155] overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
        style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-700 to-violet-700 flex-shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-blue-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-none">TCU Assistant</p>
            <p className="text-blue-200 text-xs mt-0.5">Online · Siap membantu 24/7</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.from === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 mb-0.5">
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[82%] ${msg.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-br-sm'
                      : 'bg-[#1e293b] text-slate-200 rounded-bl-sm border border-[#334155]'
                  }`}
                >
                  {parseMessage(msg.text)}
                </div>
                <span className="text-[10px] text-slate-600 px-1">{formatTime(msg.time)}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-[#1e293b] border border-[#334155] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Replies */}
        {messages.length <= 2 && !typing && (
          <div className="px-3 py-2 bg-[#0b1120] border-t border-[#1e293b] flex-shrink-0">
            <p className="text-[10px] text-slate-500 mb-2 px-1 uppercase tracking-wider font-semibold">Topik Populer</p>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_REPLIES.map(qr => (
                <button
                  key={qr.id}
                  onClick={() => handleQuickReply(qr)}
                  className="text-left text-xs text-slate-300 bg-[#1e293b] hover:bg-[#243352] border border-[#334155] hover:border-blue-500/40 px-3 py-2 rounded-xl transition-all leading-tight hover:text-white"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 px-3 py-3 bg-[#0b1120] border-t border-[#334155] flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Ketik pesan Anda…"
            className="flex-1 bg-[#1e293b] border border-[#334155] text-slate-200 placeholder-slate-500 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Kirim pesan"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* FAB Trigger Button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Tutup chat' : 'Buka chat'}
        className="fixed bottom-6 right-4 sm:right-6 z-[200] w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/30 flex items-center justify-center hover:scale-110 hover:shadow-blue-500/50 transition-all duration-300 group"
      >
        <div className={`transition-all duration-300 ${open ? 'rotate-0 opacity-100' : 'rotate-0 opacity-100'}`}>
          {open ? <ChevronDown size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
        </div>
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md animate-bounce">
            {unread}
          </span>
        )}
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping pointer-events-none" />
        )}
      </button>
    </>
  );
}
