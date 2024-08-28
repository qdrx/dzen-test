import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from './dtos/registerUser.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(user: RegisterUserDto) {
    const candidate = await this.usersRepository.findOne({
      where: { email: user.email, username: user.username },
    });
    if (candidate) {
      throw new ConflictException('Username or email is already taken');
    }
    return await this.usersRepository.save(user);
  }
}
