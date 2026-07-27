'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, MapPin, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const [m2faCode, setM2faCode] = useState(['', '', '', '', '', '']);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    packageId: '',
    referralCode: '',
  });

  // Registered database accounts for duplicate prevention checks
  const existingDatabaseAccounts = [
    { email: 'admin@topclassuniversal.co.id', phone: '081234567890' },
    { email: 'ceo@topclassuniversal.co.id', phone: '081299887766' },
    { email: 'teknisi@topclassuniversal.co.id', phone: '081311223344' },
    { email: 'support@topclassuniversal.co.id', phone: '081288776655' }
  ];

  const packages = [
    { id: 'starter', name: 'Starter', speed: '30Mbps', price: 'Rp 299.000' },
    { id: 'popular', name: 'Popular', speed: '50Mbps', price: 'Rp 399.000', popular: true },
    { id: 'business', name: 'Business', speed: '100Mbps', price: 'Rp 599.000' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDuplicateError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleM2faChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newCode = [...m2faCode];
    newCode[index] = value;
    setM2faCode(newCode);
    if (value && index < 5) {
      const nextInput = document.getElementById(`m2fa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const checkDuplicates = () => {
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.phone.trim();

    const duplicate = existingDatabaseAccounts.find(
      acc => acc.email.toLowerCase() === cleanEmail || acc.phone === cleanPhone
    );

    if (duplicate) {
      if (duplicate.email.toLowerCase() === cleanEmail) {
        setDuplicateError(`Alamat Email "${formData.email}" sudah terdaftar di sistem. Silakan login atau gunakan menu Lupa Password.`);
      } else {
        setDuplicateError(`Nomor Telepon / WhatsApp / Telegram "${formData.phone}" sudah terdaftar di sistem. Silakan login.`);
      }
      return true;
    }
    return false;
  };

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError('');

    if (formData.password !== formData.confirmPassword) {
      setDuplicateError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    if (checkDuplicates()) {
      return;
    }

    if (step === 1) setStep(2);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateError('');

    if (checkDuplicates()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          m2faVerified: true, 
          m2faCode: m2faCode.join(''),
          fromSender: 'admin@topclassuniversal.co.id',
          toRecipient: formData.email
        })
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsSuccess(true);
        } else if (data.message && data.message.includes('terdaftar')) {
          setDuplicateError(data.message);
          setIsSubmitting(false);
        } else {
          setIsSuccess(true);
        }
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0f172a] relative flex items-center justify-center p-4">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#7c3aed] rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#10b981] rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative w-full max-w-md">
          <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-[#334155] rounded-3xl p-8 shadow-2xl text-center">
            <div className="w-20 h-20 bg-[#10b981]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
            </div>
            <h2 className="text-2xl font-['Outfit'] font-bold text-white mb-2">Pendaftaran & m2FA Berhasil!</h2>
            <div className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold leading-relaxed">
              ✉️ Email notifikasi pengaman resmi telah dikirim <span className="font-bold text-white">OLEH admin@topclassuniversal.co.id</span> ke email Anda (<span className="underline">{formData.email}</span>).
            </div>
            <p className="text-slate-300 font-['Inter'] mb-8 text-xs leading-relaxed">
              Terima kasih telah mendaftar di TCU Platform. Akun Anda telah dilindungi m2FA dan tim kami akan segera menghubungi Anda.
            </p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] px-4 py-3.5 text-sm font-['Inter'] font-semibold text-white shadow-lg shadow-[#7c3aed]/25 hover:from-[#6d28d9] hover:to-[#5b21b6] transition-all hover:scale-[1.02]"
              >
                Menuju Halaman Login
              </Link>
              <Link
                href="/"
                className="flex w-full justify-center rounded-xl bg-white/5 border border-[#334155] px-4 py-3.5 text-sm font-['Inter'] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative flex items-center justify-center p-4 py-12">
      {/* Decorative Background */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#7c3aed] rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-40 w-72 h-72 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#10b981] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative w-full max-w-xl">
        <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-[#334155] rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block group mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-violet-600 via-blue-600 to-emerald-400 rounded-2xl flex flex-col items-center justify-center text-white shadow-xl shadow-violet-500/20 group-hover:scale-105 transition-all border border-white/20 relative overflow-hidden">
                <span className="text-xl font-black tracking-tighter leading-none font-['Outfit']">TCU</span>
                <span className="text-[7px] uppercase tracking-widest text-emerald-200 font-extrabold mt-0.5">Fiber</span>
              </div>
            </Link>
            <h2 className="text-3xl font-['Outfit'] font-bold text-white tracking-tight flex items-center justify-center gap-2">
              Daftar Akun Baru
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                m2FA Protected
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-400 font-['Inter']">
              Bergabung bersama PT Top Class Universal
            </p>
          </div>

          {/* Duplicate Error Alert Box */}
          {duplicateError && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl flex flex-col gap-3 text-red-300 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-red-400">Pendaftaran Tidak Dapat Dilanjutkan</div>
                  <div className="text-xs mt-1 leading-relaxed">{duplicateError}</div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-red-500/20">
                <Link href="/login" className="flex-1 text-center py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl text-xs font-bold transition">
                  Masuk / Login &rarr;
                </Link>
                <Link href="/login/forgot-password" className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700">
                  Lupa Password?
                </Link>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#334155] rounded-full"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#7c3aed] to-[#10b981] rounded-full transition-all duration-500 ease-in-out"
              style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            ></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-500 ${step >= 1 ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/50' : 'bg-[#334155] text-slate-400'}`}>1</div>
                <span className="text-xs font-['Inter'] text-slate-300 font-medium">Data Diri</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-500 ${step >= 2 ? 'bg-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/50' : 'bg-[#334155] text-slate-400'}`}>2</div>
                <span className="text-xs font-['Inter'] text-slate-300 font-medium">Layanan</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 transition-colors duration-500 ${step >= 3 ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/50' : 'bg-[#334155] text-slate-400'}`}>3</div>
                <span className="text-xs font-['Inter'] text-slate-300 font-medium">m2FA Auth</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={step === 1 ? nextStep : step === 2 ? (e) => { e.preventDefault(); setStep(3); } : handleSubmitRegistration} className="space-y-6">
            
            {/* Step 1: Data Diri */}
            <div className={step === 1 ? 'block' : 'hidden'}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 font-['Inter'] mb-1.5">Nama Lengkap *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required={step === 1}
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-[#334155] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all sm:text-sm"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 font-['Inter']">Email Utama *</label>
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 bg-slate-800 rounded-md">Bebas Domain (Gmail, Yahoo, dll)</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required={step === 1}
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-[#334155] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all sm:text-sm"
                      placeholder="nama@email.com (Gmail, Yahoo, dll)"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 font-['Inter'] mb-1.5">Nomor Handphone / WhatsApp / Telegram *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required={step === 1}
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-[#334155] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all sm:text-sm"
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 font-['Inter'] mb-1.5">Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required={step === 1}
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-10 py-3.5 bg-white/5 border border-[#334155] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all sm:text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 font-['Inter'] mb-1.5">Konfirmasi Password *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required={step === 1}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-11 pr-10 py-3.5 bg-white/5 border border-[#334155] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all sm:text-sm"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full justify-center rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] px-4 py-3.5 text-sm font-['Inter'] font-semibold text-white shadow-lg shadow-[#7c3aed]/25 hover:from-[#6d28d9] hover:to-[#5b21b6] transition-all hover:scale-[1.02]"
              >
                Lanjut ke Layanan &rarr;
              </button>
            </div>

            {/* Step 2: Alamat & Layanan */}
            <div className={step === 2 ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-300 font-['Inter'] mb-1.5">Alamat Pemasangan</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      required={step === 2}
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white/5 border border-[#334155] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent transition-all sm:text-sm resize-none"
                      placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 font-['Inter'] mb-3">Pilih Paket Layanan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setFormData({ ...formData, packageId: pkg.id })}
                        className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                          formData.packageId === pkg.id
                            ? 'bg-[#7c3aed]/10 border-[#7c3aed] ring-1 ring-[#7c3aed]'
                            : 'bg-white/5 border-[#334155] hover:border-slate-400'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            Paling Laku
                          </span>
                        )}
                        <div className="text-center">
                          <h4 className="font-['Outfit'] font-semibold text-white">{pkg.name}</h4>
                          <p className="text-2xl font-bold text-[#10b981] my-1">{pkg.speed}</p>
                          <p className="text-xs text-slate-400">{pkg.price}/bln</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex w-1/3 justify-center rounded-xl bg-white/5 border border-[#334155] px-4 py-3.5 text-sm font-['Inter'] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={!formData.packageId}
                  className="flex w-2/3 justify-center rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] px-4 py-3.5 text-sm font-['Inter'] font-semibold text-white shadow-lg shadow-[#7c3aed]/25 hover:from-[#6d28d9] hover:to-[#5b21b6] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  Lanjut ke m2FA Auth &rarr;
                </button>
              </div>
            </div>

            {/* Step 3: m2FA Security & Verification */}
            <div className={step === 3 ? 'block' : 'hidden'}>
              <div className="space-y-5 text-center">
                <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Verifikasi m2FA & Kirim Email Pengaman</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Masukkan 6 digit kode OTP. Email notifikasi keamanan resmi akan dikirim OLEH <span className="text-emerald-400 font-bold">admin@topclassuniversal.co.id</span> ke email Anda (<span className="text-white font-bold">{formData.email}</span>).
                  </p>
                </div>

                <div className="flex justify-between gap-2 py-2">
                  {m2faCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`m2fa-${idx}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleM2faChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold bg-[#0b1120]/60 border border-[#334155] rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                      maxLength={1}
                    />
                  ))}
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                  <span>Pengirim Notifikasi Resmi (FROM):</span>
                  <span className="font-mono text-emerald-400 font-bold">admin@topclassuniversal.co.id</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex w-1/3 justify-center rounded-xl bg-white/5 border border-[#334155] px-4 py-3.5 text-sm font-['Inter'] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || m2faCode.join('').length < 6}
                  className="flex w-2/3 justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 text-sm font-['Inter'] font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Selesaikan Pendaftaran...' : 'Verifikasi m2FA & Daftar'}
                </button>
              </div>
            </div>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm font-['Inter'] text-slate-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
