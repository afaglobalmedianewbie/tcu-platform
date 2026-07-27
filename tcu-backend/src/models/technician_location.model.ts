export interface TechnicianLocation {
  id: string;
  technicianId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}
