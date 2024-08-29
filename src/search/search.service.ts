import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { AllowedIndex } from './types/allowed-index.type';

@Injectable()
export class SearchService {
  constructor(private readonly elasticService: ElasticsearchService) {}

  async search(index: AllowedIndex, query: QueryDslQueryContainer) {
    return await this.elasticService.search({
      index,
      query,
    });
  }

  async index<T>(index: AllowedIndex, document: T) {
    return await this.elasticService.index({
      index,
      document,
      id: String(document['id']),
    });
  }
}
