export interface QoSProfile {
  id: string;
  name: string; // e.g. "20M_HOME"
  downloadRateKbps: number;
  uploadRateKbps: number;
  burstDownloadKbps?: number;
  burstUploadKbps?: number;
  priority: number; // 1 to 8 (1 is highest)
  fupThresholdBytes?: number; // Null for unlimited
  fupDownloadRateKbps?: number; // Speed after FUP
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerQoS {
  id: string;
  customerId: string;
  profileId: string;
  currentUsageBytes: number;
  isFupTriggered: boolean;
  dynamicBoostActive: boolean;
  lastCalculated: Date;
}

export interface QoSUsageHistory {
  id: string;
  customerId: string;
  date: Date; // Granular up to daily/hourly
  downloadBytes: number;
  uploadBytes: number;
}
