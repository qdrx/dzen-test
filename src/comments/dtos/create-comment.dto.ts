import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
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
