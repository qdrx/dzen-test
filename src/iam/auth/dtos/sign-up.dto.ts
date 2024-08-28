import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'Username must be a string' })
  @Length(4, 20, { message: 'Username must be between 4 and 20 characters' })
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @IsNotEmpty()
  password: string;
}
