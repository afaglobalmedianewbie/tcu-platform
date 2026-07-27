'use client';
import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Search, CheckCircle2, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD5qvo8YgpRTWOX9vgEjVq1LogiH7CqM70';

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center: Jawa Barat
const defaultCenter = {
  lat: -7.0,
  lng: 108.0
};

// Coordinates for active regions
const regionCoordinates = {
  pangandaran: { lat: -7.6833, lng: 108.6500 },
  banjar: { lat: -7.3686, lng: 108.5334 },
  ciamis: { lat: -7.3274, lng: 108.3532 },
  tasikmalaya: { lat: -7.3274, lng: 108.2232 },
  indramayu: { lat: -6.3262, lng: 108.3200 },
};

// Premium dark mode map styles
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1e293b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#334155" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1e293b" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#475569" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1120" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#475569" }] }
];

export default function CoveragePage() {
  const [region, setRegion] = useState('');
  const [result, setResult] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(8);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const activeRegions = Object.keys(regionCoordinates);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!region.trim()) return;

    const searchRegion = region.trim().toLowerCase();
    const isActive = activeRegions.includes(searchRegion);

    if (isActive) {
      setResult({
        status: 'active',
        title: 'Area Tercover Jaringan High Speed Fiber!',
        message: `Kabar Gembira! Jaringan fiber optik 100% FTTH PT Top Class Universal sudah AKTIF dan beroperasi di wilayah ${region.trim()}. Hubungi tim sales kami untuk pemasangan instan.`
      });
      setMapCenter(regionCoordinates[searchRegion]);
      setMapZoom(12);
    } else {
      setResult({
        status: 'planned',
        title: 'Masuk Dalam Rencana Ekspansi Prioritas',
        message: `Jaringan FTTH belum aktif di wilayah ${region.trim()}. Dapatkan prioritas penggelapan kabel dengan mendaftarkan minat Anda!`
      });
      setMapCenter(defaultCenter);
      setMapZoom(8);
    }
  };

  const selectRegion = (reg) => {
    setRegion(reg);
    const searchRegion = reg.toLowerCase();
    setResult({
      status: 'active',
      title: 'Area Tercover Jaringan High Speed Fiber!',
      message: `Kabar Gembira! Jaringan fiber optik 100% FTTH PT Top Class Universal sudah AKTIF dan beroperasi di wilayah ${reg}. Hubungi tim sales kami untuk pemasangan instan.`
    });
    setMapCenter(regionCoordinates[searchRegion]);
    setMapZoom(12);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans flex flex-col pt-16 lg:pt-20">
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <MapPin size={14} /> Jangkauan Fiber Optic
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-['Outfit'] tracking-tight text-white mb-4">
            Cek Coverage Area <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
              PT Top Class Universal
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-['Inter'] leading-relaxed">
            Periksa ketersediaan tiang ODP dan jaringan Fiber Optic super cepat di wilayah rumah atau lokasi bisnis Anda.
          </p>
        </div>

        {/* Responsive Layout Grid (Stack on Mobile, 2 Col on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Form & Controls (Order 1 on Mobile, 5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col space-y-6 order-1 lg:order-1">
            
            {/* Search Card */}
            <div className="bg-[#1e293b]/70 backdrop-blur-md border border-[#334155] rounded-2xl p-5 sm:p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white font-['Outfit'] mb-3 flex items-center gap-2">
                <Search size={18} className="text-violet-400" />
                Cek Lokasi Anda
              </h2>
              <form onSubmit={handleCheck} className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    className="w-full h-12 bg-[#0f172a] border border-[#334155] text-slate-200 placeholder:text-slate-500 rounded-xl px-4 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                    placeholder="Masukkan nama kota/kecamatan..."
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="h-12 px-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Cek Sekarang</span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Quick Area Badges */}
              <div className="mt-6 pt-5 border-t border-[#334155]">
                <p className="text-xs text-slate-400 font-medium mb-3">Wilayah Beroperasi Aktif Saat Ini:</p>
                <div className="flex flex-wrap gap-2">
                  {['Pangandaran', 'Banjar', 'Ciamis', 'Tasikmalaya', 'Indramayu'].map(reg => (
                    <button 
                      key={reg} 
                      onClick={() => selectRegion(reg)}
                      className="px-3 py-1.5 rounded-lg bg-[#0f172a] border border-[#334155] hover:border-violet-500/50 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {reg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Result Alert Card */}
            {result && (
              <div className={`p-5 sm:p-6 rounded-2xl border backdrop-blur-md transition-all animate-in fade-in duration-300 ${
                result.status === 'active' 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {result.status === 'active' ? (
                    <CheckCircle2 size={24} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={24} className="text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-bold text-base text-white">{result.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
                      {result.message}
                    </p>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-3">
                  {result.status === 'active' ? (
                    <>
                      <Link 
                        href="/register" 
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-all"
                      >
                        Daftar Pasang Baru
                      </Link>
                      <a 
                        href="https://wa.me/6282319140858" 
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#1e293b] border border-[#334155] text-slate-200 hover:text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <Phone size={14} /> Hubungi Sales WA
                      </a>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        alert('Terima kasih! Minat Anda telah dicatat dalam daftar prioritas ekspansi.');
                        setRegion('');
                        setResult(null);
                      }} 
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg transition-all"
                    >
                      Daftarkan Minat Saya
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Interactive Google Map Container (Order 2 on Mobile, 7 Cols on Desktop) */}
          <div className="lg:col-span-7 h-[350px] sm:h-[480px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-[#334155] shadow-2xl relative order-2 lg:order-2">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={mapZoom}
                options={{ styles: darkMapStyles, disableDefaultUI: true, zoomControl: true }}
              >
                {Object.entries(regionCoordinates).map(([name, coords]) => (
                  <Marker 
                    key={name} 
                    position={coords} 
                    title={`Coverage: ${name.charAt(0).toUpperCase() + name.slice(1)}`}
                    icon={{
                      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                      fillColor: '#818cf8',
                      fillOpacity: 1,
                      strokeColor: '#0f172a',
                      strokeWeight: 2,
                      scale: 1.5,
                      anchor: isLoaded ? new window.google.maps.Point(12, 24) : null
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1e293b] text-slate-400 text-sm">
                <span>Memuat Peta Jangkauan...</span>
              </div>
            )}
          </div>

        </div>

      </main>

    </div>
  );
}
