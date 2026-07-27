import { InventoryItem, StockMovement } from '../models/inventory.model';
import { Warehouse, TechnicianStock } from '../models/warehouse.model';

export class InventoryService {

  async addItem(payload: Partial<InventoryItem>) {
    console.log(`[Inventory] Added Item: ${payload.name} (${payload.type})`);
    const item: InventoryItem = {
      id: `ITEM-${Date.now()}`,
      name: payload.name!,
      type: payload.type!,
      brand: payload.brand || 'UNKNOWN',
      serialNumber: payload.serialNumber,
      sku: payload.sku || `SKU-${Date.now()}`,
      warehouseId: payload.warehouseId || 'WH-1',
      quantity: payload.quantity || 0,
      unit: payload.unit || 'PCS',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return item;
  }

  async getItem(id: string) {
    return { id, name: 'ZTE F609', type: 'ONU', quantity: 50, warehouseId: 'WH-1' };
  }

  async getInventoryList() {
    return [
      { id: 'ITEM-1', name: 'ZTE F609', type: 'ONU', quantity: 50, unit: 'PCS' },
      { id: 'ITEM-2', name: 'Drop Wire 1 Core', type: 'FIBER_OPTIC', quantity: 2000, unit: 'METERS' }
    ];
  }

  async stockIn(payload: Partial<StockMovement>, recordedBy: string) {
    console.log(`[Inventory] Stock In: ${payload.quantity} of ${payload.itemId}`);
    // Simulate DB update: Increase item quantity
    return { success: true, message: 'Stock received successfully' };
  }

  async stockOut(payload: Partial<StockMovement>, recordedBy: string) {
    console.log(`[Inventory] Stock Out: ${payload.quantity} of ${payload.itemId}`);
    
    // Simulate DB update: Decrease item quantity
    if (payload.type === 'TECHNICIAN_PICKUP' && payload.technicianId) {
      // Increase TechnicianStock
      console.log(`[Inventory] Assigned stock to Technician ${payload.technicianId}`);
    }

    return { success: true, message: 'Stock checked out successfully' };
  }

  async getStockHistory() {
    return [
      { id: 'SM-1', type: 'STOCK_IN', quantity: 100, itemId: 'ITEM-1', timestamp: new Date() },
      { id: 'SM-2', type: 'TECHNICIAN_PICKUP', quantity: 2, itemId: 'ITEM-1', technicianId: 'tech1', timestamp: new Date() }
    ];
  }

  async getWarehouses() {
    const warehouses: Warehouse[] = [
      { id: 'WH-1', name: 'Gudang Pusat Padaherang', location: 'Pangandaran', managerId: 'mgr1', createdAt: new Date() }
    ];
    return warehouses;
  }

  async addWarehouse(payload: Partial<Warehouse>) {
    console.log(`[Inventory] Warehouse Created: ${payload.name}`);
    return { success: true, message: 'Warehouse created successfully' };
  }
}
