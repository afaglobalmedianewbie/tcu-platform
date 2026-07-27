import { create } from 'zustand';
import { NocDashboardData, OltDevice, PppoeSession, NocMapPoint } from '../types/noc';

interface NOCStoreState {
  dashboardData: NocDashboardData | null;
  olts: OltDevice[];
  sessions: PppoeSession[];
  mapPoints: NocMapPoint[];
  setDashboardData: (data: NocDashboardData) => void;
  setOlts: (olts: OltDevice[]) => void;
  setSessions: (sessions: PppoeSession[]) => void;
  setMapPoints: (points: NocMapPoint[]) => void;
  updateOltStatus: (id: string, status: OltDevice['status']) => void;
}

export const useNOCStore = create<NOCStoreState>((set) => ({
  dashboardData: null,
  olts: [],
  sessions: [],
  mapPoints: [],
  setDashboardData: (dashboardData) => set({ dashboardData }),
  setOlts: (olts) => set({ olts }),
  setSessions: (sessions) => set({ sessions }),
  setMapPoints: (mapPoints) => set({ mapPoints }),
  updateOltStatus: (id, status) => set((state) => ({
    olts: state.olts.map((olt) =>
      olt.id === id ? { ...olt, status } : olt
    ),
  })),
}));
