'use client';

import React from 'react';
import { useCustomerDashboard, useSpeedtest } from '../../../hooks/useCustomerDashboard';
import { useCustomerStore } from '../../../store/customerStore';
import InternetStatus from '../../../components/customer/InternetStatus';
import SignalCard from '../../../components/customer/SignalCard';
import InvoiceCard from '../../../components/customer/InvoiceCard';
import SubscriptionCard from '../../../components/customer/SubscriptionCard';
import TicketList from '../../../components/customer/TicketList';

export default function CustomerDashboardPage() {
  const { data: dashboardData, isLoading } = useCustomerDashboard();
  const speedtestMutation = useSpeedtest();
  const { speedtestResult, isTestingSpeed } = useCustomerStore();

  const handleSpeedtest = () => {
    speedtestMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        
        {/* Top Header */}
        <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
              <span className="text-[#7B4DFF]">👋</span> Halo, {isLoading ? 'Pelanggan' : dashboardData?.customerName}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              PPPoE ID: <span className="text-slate-300 font-semibold">{isLoading ? '...' : dashboardData?.pppoeUsername}</span>
            </p>
          </div>

          <button
            onClick={() => alert('Mengalihkan ke Portal Hubungi Kami...')}
            className="w-full md:w-auto px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition duration-150"
          >
            🎫 Buka Tiket Aduan
          </button>
        </header>

        {isLoading || !dashboardData ? (
          <div className="space-y-6">
            <div className="h-16 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="h-44 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Connection Status Banner */}
            <InternetStatus status={dashboardData.internetStatus} />

            {/* Billing & Signal Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InvoiceCard invoice={dashboardData.activeInvoice} />
              <SubscriptionCard subscription={dashboardData.subscription} />
              <SignalCard rxPower={dashboardData.onuSignal.rxPower} status={dashboardData.onuSignal.status} />
            </div>

            {/* Speedtest Widget */}
            <section className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-200">
                    Uji Kecepatan Koneksi (Speedtest)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Uji bandwidth langsung dari ONT Anda ke Server Terdekat.
                  </p>
                </div>
                <button
                  onClick={handleSpeedtest}
                  disabled={isTestingSpeed}
                  className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-violet-600 to-[#7B4DFF] hover:from-violet-500 hover:to-[#7B4DFF]/90 text-white text-sm font-black rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-600/35 transition duration-150 disabled:opacity-50"
                >
                  {isTestingSpeed ? 'MENGUJI KONEKSI...' : '🚀 MULAI SPEEDTEST'}
                </button>
              </div>

              {/* Speedtest Results Display */}
              {isTestingSpeed && (
                <div className="mt-8 flex justify-center py-6">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#7B4DFF] animate-spin" />
                  </div>
                </div>
              )}

              {speedtestResult && !isTestingSpeed && (
                <div className="mt-8 grid grid-cols-3 gap-6 p-6 rounded-xl bg-slate-950/20 border border-slate-850/60 text-center animate-in fade-in duration-300">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Ping Latency</span>
                    <span className="text-xl md:text-2xl font-black text-slate-200">{speedtestResult.ping} <span className="text-xs font-semibold text-slate-400">ms</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Download Speed</span>
                    <span className="text-xl md:text-2xl font-black text-emerald-400">{speedtestResult.download} <span className="text-xs font-semibold text-slate-400">Mbps</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Upload Speed</span>
                    <span className="text-xl md:text-2xl font-black text-violet-400">{speedtestResult.upload} <span className="text-xs font-semibold text-slate-400">Mbps</span></span>
                  </div>
                </div>
              )}
            </section>

            {/* ─── FEATURE 4: Self-Service Customer Portal via GenieACS TR-069 ─── */}
            <SelfServiceControlSection />

            {/* Complaint Tickets */}
            <TicketList tickets={dashboardData.tickets} />

          </div>
        )}

      </div>
    </div>
  );
}

// ─── Self-Service Control Component ───
function SelfServiceControlSection() {
  const [showRebootModal, setShowRebootModal] = React.useState(false);
  const [showWifiModal, setShowWifiModal] = React.useState(false);

  const [isRebooting, setIsRebooting] = React.useState(false);
  const [rebootDone, setRebootDone] = React.useState(false);
  const [rebootTimeLeft, setRebootTimeLeft] = React.useState(120);

  const [wifiForm, setWifiForm] = React.useState({ ssid: 'TCU_HOME_WIFI', password: '' });
  const [showPasswordText, setShowPasswordText] = React.useState(false);
  const [isSavingWifi, setIsSavingWifi] = React.useState(false);
  const [wifiStatusMsg, setWifiStatusMsg] = React.useState<string | null>(null);

  const handleConfirmReboot = async () => {
    setIsRebooting(true);
    setRebootDone(false);
    setRebootTimeLeft(120);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await fetch('/api/customer/reboot-ont', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (err) {
      console.error('Reboot error:', err);
    }

    const interval = setInterval(() => {
      setRebootTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRebooting(false);
          setRebootDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSaveWifi = async () => {
    if (!wifiForm.password || wifiForm.password.length < 8) {
      setWifiStatusMsg('Password Wi-Fi minimal 8 karakter!');
      return;
    }

    setIsSavingWifi(true);
    setWifiStatusMsg(null);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/customer/change-wifi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(wifiForm)
      });
      const data = await res.json();
      if (data.success) {
        setWifiStatusMsg('✅ SSID & Password Wi-Fi berhasil diperbarui via TR-069 GenieACS!');
        setTimeout(() => {
          setShowWifiModal(false);
          setWifiStatusMsg(null);
        }, 1800);
      } else {
        setWifiStatusMsg('❌ ' + (data.message || 'Gagal mengubah password Wi-Fi'));
      }
    } catch (err: any) {
      setWifiStatusMsg('❌ Gagal: ' + err.message);
    } finally {
      setIsSavingWifi(false);
    }
  };

  return (
    <section className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#7B4DFF] block">
            GENIEACS TR-069 INSTANT CONTROL
          </span>
          <h3 className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2">
            🛠️ Self-Service Portal Mandiri Modem
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Lakukan restart modem atau ganti password Wi-Fi mandiri secara instan tanpa antre Call Center.
          </p>
        </div>

        {/* WhatsApp Bot Link Shortcut */}
        <a
          href="https://wa.me/6281234567890?text=Halo%20TCU%20Bot,%20saya%20ingin%20Self-Service%20Modem"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center gap-2"
        >
          <span>📱 Chat WhatsApp Bot</span>
        </a>
      </div>

      {/* 2 Main Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: ONT Reboot */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl">🔄</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                GenieACS TR-069 RPC
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-200">Restart Modem Mandiri (ONT Reboot)</h4>
            <p className="text-xs text-slate-400">
              Gunakan jika koneksi lambat atau terasa berat. Sistem akan mengirim perintah reboot ke modem ONT Anda.
            </p>
          </div>

          <button
            onClick={() => setShowRebootModal(true)}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🔄 Reboot ONT Sekarang</span>
          </button>
        </div>

        {/* Card 2: Change Wi-Fi Password */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xl">🔐</span>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[10px] font-bold">
                Instant WiFi Push
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-200">Ganti Password Wi-Fi Mandiri</h4>
            <p className="text-xs text-slate-400">
              Perbarui SSID nama Wi-Fi & kata sandi WPA2 Anda secara instan dari dashboard ini.
            </p>
          </div>

          <button
            onClick={() => setShowWifiModal(true)}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-[#7B4DFF] hover:from-violet-500 hover:to-[#7B4DFF]/90 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md shadow-violet-600/20 flex items-center justify-center gap-2"
          >
            <span>🔑 Ubah SSID & Password Wi-Fi</span>
          </button>
        </div>

      </div>

      {/* ─── MODAL REBOOT ONT ─── */}
      {showRebootModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                🔄 Konfirmasi Reboot ONT Modem
              </h4>
              <button onClick={() => setShowRebootModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {!isRebooting && !rebootDone && (
              <div className="space-y-4 text-xs text-slate-300">
                <p>
                  Apakah Anda yakin ingin menyuruh sistem merestart modem ONT Anda?
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <div className="font-bold">⚠️ Perhatian:</div>
                  <p>Koneksi internet Anda akan terputus sementara selama proses booting (~2 menit).</p>
                </div>
              </div>
            )}

            {isRebooting && (
              <div className="py-6 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
                </div>
                <div>
                  <h5 className="font-black text-white text-sm">Mengirim Perintah Reboot TR-069...</h5>
                  <p className="text-xs text-slate-400 mt-1">Estimasi booting ulang: <span className="font-mono text-violet-400 font-bold">{rebootTimeLeft} detik</span></p>
                </div>
              </div>
            )}

            {rebootDone && (
              <div className="py-4 text-center space-y-3">
                <div className="text-3xl">✅</div>
                <h5 className="font-black text-emerald-400 text-sm">Reboot Selesai Dikirim!</h5>
                <p className="text-xs text-slate-300">Modem Anda telah menerima sinyal reboot dan sedang menyala kembali.</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              {!isRebooting ? (
                <>
                  <button
                    onClick={() => setShowRebootModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmReboot}
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black rounded-xl transition shadow-md shadow-violet-600/30"
                  >
                    Ya, Reboot Sekarang
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowRebootModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Tutup
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL GANTI WIFI ─── */}
      {showWifiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 text-slate-100 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-black text-slate-100 flex items-center gap-2">
                🔐 Ganti Nama (SSID) & Password Wi-Fi
              </h4>
              <button onClick={() => setShowWifiModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Nama Wi-Fi (SSID)</label>
                <input
                  type="text"
                  value={wifiForm.ssid}
                  onChange={(e) => setWifiForm({ ...wifiForm, ssid: e.target.value })}
                  placeholder="Contoh: TCU_HOME_WIFI"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Password Wi-Fi Baru (WPA2)</label>
                <div className="relative">
                  <input
                    type={showPasswordText ? 'text' : 'password'}
                    value={wifiForm.password}
                    onChange={(e) => setWifiForm({ ...wifiForm, password: e.target.value })}
                    placeholder="Minimal 8 Karakter..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                  >
                    {showPasswordText ? 'Hide' : 'Show'}
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Rekomendasi: gabungan huruf besar, huruf kecil & angka</span>
              </div>

              {wifiStatusMsg && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200">
                  {wifiStatusMsg}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowWifiModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleSaveWifi}
                disabled={isSavingWifi}
                className="px-5 py-2 bg-gradient-to-r from-violet-600 to-[#7B4DFF] hover:from-violet-500 hover:to-[#7B4DFF]/90 text-white text-xs font-black rounded-xl transition shadow-md shadow-violet-600/30 disabled:opacity-50"
              >
                {isSavingWifi ? 'Pumping to TR-069...' : 'Simpan ke Modem (TR-069)'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

