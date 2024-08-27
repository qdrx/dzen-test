import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { instanceToPlain } from 'class-transformer';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(user: RegisterUserDto) {
    const candidate = await this.usersRepository.findOne({
      where: { email: user.email, username: user.username },
    });
    if (candidate) {
      throw new UnprocessableEntityException(
        'Username or email is already taken',
      );
    }
    return new User(await this.usersRepository.save(user));
  }
}
