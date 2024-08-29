import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        node: configService.get('elastic.node'),
        auth: {
          username: configService.get('elastic.username'),
          password: configService.get('elastic.password'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [SearchService],
})
export class SearchModule {}
