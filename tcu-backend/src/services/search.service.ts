import { SearchResult, SearchLog } from '../models/search.model';
import { SearchIndexerService } from './search_indexer.service';

export class SearchService {
  private indexer = new SearchIndexerService();

  constructor() {
    // Initial auto-build for testing
    this.indexer.rebuildFullIndex();
  }

  /**
   * Universal Search (Fuzzy + Score-based Relevance)
   */
  async search(query: string, userId: string, limit: number = 10): Promise<SearchResult[]> {
    if (!query) return [];

    const searchStr = query.toLowerCase();
    const documents = this.indexer.getRawIndex();
    
    const results: SearchResult[] = [];

    for (const doc of documents) {
      let score = 0;

      // Exact Match Title (Highest Relevance)
      if (doc.title.toLowerCase().includes(searchStr)) score += 100;
      
      // Exact Match Keywords
      if (doc.keywords.some(k => k.toLowerCase() === searchStr)) score += 50;
      
      // Partial Match Description
      if (doc.description.toLowerCase().includes(searchStr)) score += 10;
      
      // Fuzzy Match Keywords
      if (doc.keywords.some(k => k.toLowerCase().includes(searchStr))) score += 5;

      if (score > 0) {
        results.push({
          score,
          type: doc.type,
          id: doc.id,
          title: doc.title,
          description: doc.description,
          metadata: doc.metadata
        });
      }
    }

    // Sort by Highest Score
    results.sort((a, b) => b.score - a.score);
    const paginated = results.slice(0, limit);

    // Write Search Log
    this.logSearch(query, userId, paginated.length);

    return paginated;
  }

  async getSuggestions(query: string) {
    // Fast top 5 titles for auto-complete
    const results = await this.search(query, 'sys', 5);
    return results.map(r => r.title);
  }

  async rebuildIndex() {
    return this.indexer.rebuildFullIndex();
  }

  private async logSearch(query: string, userId: string, resultCount: number) {
    const log: SearchLog = {
      id: `SLOG-${Date.now()}`,
      userId,
      query,
      resultCount,
      timestamp: new Date()
    };
    console.log(`[Search] Query: "${query}" returned ${resultCount} results.`);
  }
}
