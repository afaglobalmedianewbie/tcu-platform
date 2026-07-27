export interface WorkOrder {
  id: string;
  customerName: string;
  address: string;
  type: 'INSTALLATION' | 'MAINTENANCE' | 'DISCONNECT';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'ON_ROUTE' | 'IN_PROGRESS' | 'COMPLETED';
  scheduledTime: string;
}

export interface TechnicianLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  lastUpdated: string;
}

export interface PendingTask {
  id: string;
  taskName: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'WO' | 'MEETING' | 'BREAK';
}

export interface TechnicianDashboardData {
  workOrders: WorkOrder[];
  location: TechnicianLocation;
  tasks: PendingTask[];
  schedule: ScheduleEvent[];
}
