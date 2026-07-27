'use client';
import React, { useState } from 'react';
import { ConfigTemplate } from '../../types/config';
import { useApplyTemplate } from '../../hooks/useConfig';

interface ApplyTemplateModalProps {
  template: ConfigTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyTemplateModal({
  template,
  isOpen,
  onClose
}: ApplyTemplateModalProps) {
  const mutation = useApplyTemplate();
  const [speedVar, setSpeedVar] = useState<string>('50');

  if (!isOpen || !template) return null;

  const handleConfirm = () => {
    mutation.mutate(
      {
        id: template.id,
        variables: { speed: speedVar }
      },
      {
        onSuccess: () => {
          alert(`Konfigurasi template ${template.name} berhasil diterapkan!`);
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        
        <div className="text-center mb-6">
          <div className="text-4xl md:text-5xl mb-4">🚀</div>
          <h2 className="text-xl md:text-2xl font-black text-slate-100 mb-2">
            Penerapan Konfigurasi
          </h2>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
            Anda akan menerapkan template **{template.name}** ke seluruh perangkat aktif di cluster **{template.target}**.
          </p>
        </div>

        {template.target === 'GENIEACS' && (
          <div className="space-y-4 mb-6 text-left">
            <label className="text-xs text-slate-400 font-semibold block">
              Variabel Parameter: Kecepatan Bandwidth (Mbps)
            </label>
            <input
              type="number"
              value={speedVar}
              onChange={(e) => setSpeedVar(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs focus:ring-[#7B4DFF] focus:border-[#7B4DFF]"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Batalkan
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-[#7B4DFF] hover:bg-[#7b4dff]/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-violet-600/10 transition"
          >
            Ya, Terapkan
          </button>
        </div>

      </div>
    </div>
  );
}
