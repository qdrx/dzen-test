import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @IsNotEmpty()
  password: string;
}
