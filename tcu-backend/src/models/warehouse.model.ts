export interface Warehouse {
  id: string;
  name: string;
  location: string;
  geolocation?: {
    lat: number;
    lng: number;
  };
  capacity?: number;
  managerId: string;
  createdAt: Date;
}

export interface TechnicianStock {
  id: string;
  technicianId: string;
  itemId: string;
  quantity: number;
  lastUpdated: Date;
}
