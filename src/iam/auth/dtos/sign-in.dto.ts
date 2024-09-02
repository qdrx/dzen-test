import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ type: String, example: 'example@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: 'password123' })
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @IsNotEmpty()
  password: string;
}
