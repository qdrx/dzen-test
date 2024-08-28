import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [UsersModule],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    AuthService,
  ],
  controllers: [AuthController],
})
export class IamModule {}
