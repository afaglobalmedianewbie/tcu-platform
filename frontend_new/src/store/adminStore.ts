import { create } from 'zustand';
import { DashboardData, NocAlert, TechnicianActivity } from '../types/dashboard';

interface AdminStoreState {
  dashboardData: DashboardData | null;
  alerts: NocAlert[];
  activities: TechnicianActivity[];
  setDashboardData: (data: DashboardData) => void;
  setAlerts: (alerts: NocAlert[]) => void;
  addAlert: (alert: NocAlert) => void;
  setActivities: (activities: TechnicianActivity[]) => void;
  updateTechnicianStatus: (id: string, status: TechnicianActivity['status']) => void;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  dashboardData: null,
  alerts: [],
  activities: [],
  setDashboardData: (dashboardData) => set({ dashboardData }),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) })), // Keep last 50 alerts
  setActivities: (activities) => set({ activities }),
  updateTechnicianStatus: (id, status) => set((state) => ({
    activities: state.activities.map((tech) =>
      tech.id === id ? { ...tech, status } : tech
    ),
  })),
}));
