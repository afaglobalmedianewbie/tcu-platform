export interface SearchIndex {
  id: string; // e.g. "CST-101" or "INV-202"
  type: 'CUSTOMER' | 'BILLING' | 'TICKET' | 'OLT' | 'ONU' | 'PPPOE' | 'INVENTORY' | 'TECHNICIAN' | 'LOG';
  title: string; // High relevance field
  description: string; // Medium relevance field
  keywords: string[]; // Fuzzy searchable tokens
  metadata: any; // Raw document payload for quick access
  lastIndexedAt: Date;
}

export interface SearchLog {
  id: string;
  userId: string;
  query: string;
  resultCount: number;
  timestamp: Date;
}

export interface SearchResult {
  score: number;
  type: string;
  id: string;
  title: string;
  description: string;
  metadata: any;
}
