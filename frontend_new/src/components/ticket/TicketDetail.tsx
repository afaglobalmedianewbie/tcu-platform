'use client';
import React, { useState } from 'react';
import { Ticket } from '../../types/ticket';
import { useUpdateTicket } from '../../hooks/useTicket';

interface TicketDetailProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export default function TicketDetail({ ticket, onClose }: TicketDetailProps) {
  const mutation = useUpdateTicket();
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);

  if (!ticket) return null;

  const handleUpdateStatus = (status: Ticket['status']) => {
    mutation.mutate(
      { id: ticket.id, status },
      {
        onSuccess: () => {
          alert(`Status tiket ${ticket.id} diubah menjadi ${status}`);
          onClose();
        }
      }
    );
  };

  const handleAssignStaff = () => {
    if (!selectedStaff) return;
    mutation.mutate(
      { id: ticket.id, status: 'PROCESSING', assignedTo: selectedStaff },
      {
        onSuccess: () => {
          alert(`Tiket ${ticket.id} berhasil ditugaskan ke ${selectedStaff}`);
          setIsAssignModalOpen(false);
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Detail Keluhan</span>
            <h3 className="text-xl font-black text-slate-100 mt-1">{ticket.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition text-lg"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs md:text-sm">
          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Subject Masalah</span>
            <span className="text-slate-200 font-bold text-base">{ticket.title}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-0.5 font-medium">Deskripsi Lengkap</span>
            <p className="text-slate-350 leading-relaxed font-medium bg-slate-950/20 p-4 rounded-xl border border-slate-850/50">
              {ticket.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-b border-slate-800/80 py-4">
            <div>
              <span className="text-slate-500 block mb-0.5">Kategori</span>
              <span className="text-slate-300 font-bold">{ticket.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Prioritas</span>
              <span className="text-slate-300 font-bold">{ticket.priority}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Petugas WO</span>
              <span className="text-[#7B4DFF] font-black">{ticket.assignedTo || 'Unassigned'}</span>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="mt-8 flex flex-col gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex-1 py-3 px-4 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
            >
              👤 Tugaskan Staf / Teknisi
            </button>
            
            {ticket.status !== 'RESOLVED' && (
              <button
                onClick={() => handleUpdateStatus('RESOLVED')}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/10 transition"
              >
                ✓ Selesaikan Tiket
              </button>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-850 hover:bg-slate-800 text-slate-400 font-semibold text-xs rounded-xl transition"
          >
            Tutup
          </button>
        </div>

        {/* Assignment Dialog Modal (Inner Overlay) */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-slate-900 border border-slate-850 rounded-xl p-6 max-w-sm w-full shadow-2xl">
              <h4 className="text-base font-black text-slate-100 mb-4">
                Penugasan Teknisi Lapangan
              </h4>
              
              <div className="space-y-4">
                <label className="text-xs text-slate-400 font-medium block">
                  Pilih Staf Lapangan
                </label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs focus:ring-[#7B4DFF] focus:border-[#7B4DFF]"
                >
                  <option value="">-- Pilih Teknisi --</option>
                  <option value="Andi Pratama">Andi Pratama (Banjar)</option>
                  <option value="Budi Santoso">Budi Santoso (Ciamis)</option>
                  <option value="Citra Lestari">Citra Lestari (Pangandaran)</option>
                </select>
              </div>

              <div className="mt-6 flex gap-4 text-xs font-bold">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleAssignStaff}
                  disabled={!selectedStaff}
                  className="flex-1 py-2 bg-[#7B4DFF] hover:bg-[#7b4dff]/90 text-white rounded-lg transition disabled:opacity-50"
                >
                  Tugaskan
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
