'use client';

import React from 'react';
import { useTechnicianDashboard } from '../../../hooks/useTechnicianDashboard';
import { useTechnicianStore } from '../../../store/technicianStore';
import WorkOrderList from '../../../components/technician/WorkOrderList';
import TechnicianMap from '../../../components/technician/TechnicianMap';
import PendingTasks from '../../../components/technician/PendingTasks';
import Schedule from '../../../components/technician/Schedule';
import RoleGuard from '../../../components/rbac/RoleGuard';

export default function TechnicianDashboardPage() {
  const { data: dashboardData, isLoading } = useTechnicianDashboard();
  const { location } = useTechnicianStore();

  return (
    <RoleGuard
      allowedRoles={['ADMIN', 'SUPERADMIN', 'TEKNISI', 'OPERATOR']}
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-center font-sans p-6">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-slate-100">Akses Terbatas</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-sm">
            Izin Anda tidak mencukupi untuk melihat portal Technician App.
          </p>
        </div>
      }
    >
      <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans p-6 md:p-10">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          
          {/* Header */}
          <header className="mb-8 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight flex items-center gap-3">
                <span className="text-[#7B4DFF]">🛠️</span> Technician Field Portal
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Pantau penugasan tiket WO aktif, koordinat GPS lapangan, dan agenda pengerjaan.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              GPS Aktif
            </div>
          </header>

          {isLoading || !dashboardData ? (
            <div className="space-y-6">
              <div className="h-44 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-36 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
                <div className="h-36 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Main Work Orders Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Work Order List (Left/Main) */}
                <div className="lg:col-span-2 space-y-8">
                  <WorkOrderList workOrders={dashboardData.workOrders} />
                  <TechnicianMap location={location} />
                </div>

                {/* Tasks & Schedule (Right/Sidebar) */}
                <div className="space-y-8">
                  <Schedule events={dashboardData.schedule} />
                  <PendingTasks tasks={dashboardData.tasks} />
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </RoleGuard>
  );
}
