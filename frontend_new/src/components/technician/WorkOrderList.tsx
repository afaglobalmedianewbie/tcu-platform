'use client';
import React from 'react';
import { WorkOrder } from '../../types/technician';
import { useUpdateWorkOrderStatus } from '../../hooks/useTechnicianDashboard';

interface WorkOrderListProps {
  workOrders: WorkOrder[];
}

export default function WorkOrderList({ workOrders }: WorkOrderListProps) {
  const mutation = useUpdateWorkOrderStatus();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Tunggu';
      case 'ON_ROUTE': return 'Dalam Perjalanan';
      case 'IN_PROGRESS': return 'Dikerjakan';
      default: return 'Selesai';
    }
  };

  const handleStatusChange = (id: string, currentStatus: WorkOrder['status']) => {
    let nextStatus: WorkOrder['status'] = 'COMPLETED';
    if (currentStatus === 'PENDING') nextStatus = 'ON_ROUTE';
    else if (currentStatus === 'ON_ROUTE') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';
    
    mutation.mutate({ id, status: nextStatus });
  };

  return (
    <div className="p-6 md:p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
      <h3 className="text-base md:text-lg font-bold text-slate-200 mb-6">
        Daftar Perintah Kerja (Work Order)
      </h3>

      <div className="space-y-6">
        {workOrders.length === 0 ? (
          <p className="text-xs md:text-sm text-slate-500 text-center py-6">
            Tidak ada perintah kerja aktif hari ini.
          </p>
        ) : (
          workOrders.map((wo) => (
            <div
              key={wo.id}
              className="p-5 rounded-xl bg-slate-950/20 border border-slate-850/60 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-250 hover:border-slate-800"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-slate-400">{wo.id}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold uppercase">
                    {wo.type}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black tracking-wider uppercase ${
                    getPriorityColor(wo.priority)
                  }`}>
                    {wo.priority}
                  </span>
                </div>
                
                <h4 className="text-sm md:text-base font-bold text-slate-100 mt-3 break-words">
                  {wo.customerName}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{wo.address}</p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500 font-semibold">
                  <span>⏰</span>
                  <span>Jadwal: {wo.scheduledTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className="text-xs">
                  <span className="text-slate-500 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Status</span>
                  <span className="font-bold text-slate-300">{getStatusLabel(wo.status)}</span>
                </div>
                {wo.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(wo.id, wo.status)}
                    className="w-full md:w-auto py-2 px-4 bg-[#7B4DFF] hover:bg-[#7b4dff]/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7B4DFF]/15 transition duration-150"
                  >
                    {wo.status === 'PENDING' ? 'Mulai Perjalanan' : wo.status === 'ON_ROUTE' ? 'Mulai Kerja' : 'Selesaikan WO'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
