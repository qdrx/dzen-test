import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CommentsController } from './comments.controller';
import { FileModule } from './file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), FileModule],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
})
export class CommentsModule {}
