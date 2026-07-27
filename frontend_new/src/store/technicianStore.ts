import { create } from 'zustand';
import { TechnicianDashboardData, WorkOrder, TechnicianLocation, PendingTask } from '../types/technician';

interface TechnicianStoreState {
  dashboardData: TechnicianDashboardData | null;
  location: TechnicianLocation | null;
  selectedWorkOrder: WorkOrder | null;
  setDashboardData: (data: TechnicianDashboardData) => void;
  setLocation: (loc: TechnicianLocation) => void;
  setSelectedWorkOrder: (wo: WorkOrder | null) => void;
  updateWorkOrderStatus: (id: string, status: WorkOrder['status']) => void;
  updateTaskStatus: (id: string, status: PendingTask['status']) => void;
}

export const useTechnicianStore = create<TechnicianStoreState>((set) => ({
  dashboardData: null,
  location: null,
  selectedWorkOrder: null,
  setDashboardData: (dashboardData) => set({ dashboardData }),
  setLocation: (location) => set({ location }),
  setSelectedWorkOrder: (selectedWorkOrder) => set({ selectedWorkOrder }),
  updateWorkOrderStatus: (id, status) => set((state) => {
    if (!state.dashboardData) return {};
    const updatedWOs = state.dashboardData.workOrders.map((wo) =>
      wo.id === id ? { ...wo, status } : wo
    );
    return {
      dashboardData: {
        ...state.dashboardData,
        workOrders: updatedWOs
      }
    };
  }),
  updateTaskStatus: (id, status) => set((state) => {
    if (!state.dashboardData) return {};
    const updatedTasks = state.dashboardData.tasks.map((task) =>
      task.id === id ? { ...task, status } : task
    );
    return {
      dashboardData: {
        ...state.dashboardData,
        tasks: updatedTasks
      }
    };
  }),
}));
