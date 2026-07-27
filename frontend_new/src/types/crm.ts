export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
  createdAt: string;
}

export interface CustomerDetailData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pppoeUsername: string;
  bandwidthProfile: string;
  connectionStatus: 'ONLINE' | 'OFFLINE';
  onuRxPower: number;
}
