export interface TopologyNode {
  id: string;
  type: 'CLOUD' | 'MIKROTIK' | 'OLT' | 'ONU' | 'CUSTOMER' | 'TECHNICIAN';
  name: string;
  ipAddress?: string;
  geolocation?: {
    lat: number;
    lng: number;
  };
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'UNKNOWN';
  metadata?: any;
}

export interface TopologyLink {
  id: string;
  sourceId: string; // e.g. OLT ID
  targetId: string; // e.g. ONU ID
  type: 'VPN' | 'FIBER' | 'ETHERNET' | 'PPPOE';
  status: 'ACTIVE' | 'DOWN';
  metadata?: any;
}

export interface TopologyAlert {
  id: string;
  nodeId: string;
  type: 'ONU_OFFLINE' | 'LOW_SIGNAL' | 'PPPOE_DROP' | 'OLT_UNREACHABLE' | 'VPN_DISCONNECTED';
  message: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  timestamp: Date;
}
