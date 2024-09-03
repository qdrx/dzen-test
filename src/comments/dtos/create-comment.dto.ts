import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ type: String, example: 'email@example.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'username' })
  @IsOptional()
  @Length(3, 10, { message: 'Username must be between 3 and 10 characters' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({ type: String, example: 'This is <i>my</i> comment' })
  @IsString()
  content: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'ID of the comment to reply to, if not valid returns null',
  })
  @IsNumber()
  @IsOptional()
  replyTo?: number;
}
