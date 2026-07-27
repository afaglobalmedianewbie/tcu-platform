export interface InventoryItem {
  id: string;
  name: string;
  type: 'OLT' | 'ONU' | 'ROUTER' | 'FIBER_OPTIC' | 'PATCH_CORD' | 'TOOLS' | 'SPARE_PARTS';
  brand: string;
  serialNumber?: string;
  sku: string;
  warehouseId: string;
  quantity: number;
  unit: 'PCS' | 'METERS' | 'BOXES';
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  itemId: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'TECHNICIAN_PICKUP';
  quantity: number;
  sourceWarehouseId?: string;
  destinationWarehouseId?: string;
  technicianId?: string; // If TECHNICIAN_PICKUP
  referenceId?: string; // e.g. ticketId or workOrderId for STOCK_OUT
  notes: string;
  recordedBy: string;
  timestamp: Date;
}
