import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from '../common/repositories/generic-typeorm.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends TypeOrmRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository.target, repository.manager.connection);
  }
}
