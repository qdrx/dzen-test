import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { User } from '../../users/entities/user.entity';
import { SignInDto } from './dtos/sign-in.dto';
import { UsersRepository } from '../../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userRepo: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = new User();
    user.email = dto.email;
    user.username = dto.username;
    user.password = await this.hashingService.hash(dto.password);
    return this.userService.create(user);
  }

  async signIn(dto: SignInDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }
    const token = await this.generateJwtToken(user);
    return { user, token };
  }

  async generateJwtToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
    } as ActiveUserData;
    return this.jwtService.sign(payload);
  }
}
