import { create } from 'zustand';
import { CustomerDashboardData, SpeedtestResult } from '../types/customer';

interface CustomerStoreState {
  dashboardData: CustomerDashboardData | null;
  speedtestResult: SpeedtestResult | null;
  isTestingSpeed: boolean;
  setDashboardData: (data: CustomerDashboardData) => void;
  setSpeedtestResult: (result: SpeedtestResult | null) => void;
  setIsTestingSpeed: (testing: boolean) => void;
}

export const useCustomerStore = create<CustomerStoreState>((set) => ({
  dashboardData: null,
  speedtestResult: null,
  isTestingSpeed: false,
  setDashboardData: (dashboardData) => set({ dashboardData }),
  setSpeedtestResult: (speedtestResult) => set({ speedtestResult }),
  setIsTestingSpeed: (isTestingSpeed) => set({ isTestingSpeed }),
}));
