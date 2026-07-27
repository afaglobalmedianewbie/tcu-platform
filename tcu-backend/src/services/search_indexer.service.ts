import { SearchIndex } from '../models/search.model';

export class SearchIndexerService {
  private memoryIndex: Map<string, SearchIndex> = new Map();

  /**
   * Rebuild the entire search index from all core tables
   */
  async rebuildFullIndex() {
    console.log(`[Search-Indexer] Initiating Full Index Rebuild...`);
    this.memoryIndex.clear();
    
    // Simulate Fetching Data from CRM, Billing, Ticketing, etc.
    const mockData: SearchIndex[] = [
      { id: 'CST-001', type: 'CUSTOMER', title: 'John Doe', description: 'Address: Lintas 5, Phone: 0812345678', keywords: ['john', 'doe', 'pppoe_johndoe'], metadata: {}, lastIndexedAt: new Date() },
      { id: 'INV-123', type: 'BILLING', title: 'Invoice INV-123', description: 'Rp150,000 - UNPAID', keywords: ['INV-123', 'unpaid', 'john doe'], metadata: {}, lastIndexedAt: new Date() },
      { id: 'TKT-888', type: 'TICKET', title: 'Internet Slow', description: 'Reported by John Doe, Status: OPEN', keywords: ['slow', 'open'], metadata: {}, lastIndexedAt: new Date() },
      { id: 'ZTE-SN-1234', type: 'ONU', title: 'ONU ZTE F609', description: 'SN: ZTEG12345678, LOID: 9999', keywords: ['zteg12345678', 'f609'], metadata: {}, lastIndexedAt: new Date() }
    ];

    for (const doc of mockData) {
      this.memoryIndex.set(doc.id, doc);
    }
    
    console.log(`[Search-Indexer] Indexed ${this.memoryIndex.size} documents successfully.`);
    return { success: true, totalIndexed: this.memoryIndex.size };
  }

  /**
   * Incremental Indexing for Webhooks
   */
  async indexDocument(doc: SearchIndex) {
    this.memoryIndex.set(doc.id, doc);
    console.log(`[Search-Indexer] Document ${doc.id} indexed incrementally.`);
  }

  getRawIndex() {
    return Array.from(this.memoryIndex.values());
  }
}
