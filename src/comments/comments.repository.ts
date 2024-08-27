import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '../common/repositories/generic-typeorm.repository';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsRepository extends TypeOrmRepository<Comment> {
  constructor(
    @InjectRepository(Comment)
    repository: Repository<Comment>,
  ) {
    super(repository.target, repository.manager.connection);
  }
}
