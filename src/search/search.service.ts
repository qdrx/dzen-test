import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class SearchService {
  constructor(private readonly elasticService: ElasticsearchService) {}

  async search(index: string, query: QueryDslQueryContainer) {
    return await this.elasticService.search({
      index,
      query,
    });
  }

  async index<T>(index: string, document: T) {
    return await this.elasticService.index({
      index,
      document,
    });
  }
}
