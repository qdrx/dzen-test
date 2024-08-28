import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getComments() {
    return this.commentsService.getComments();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createComment(
    @Body() dto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.commentsService.createComment(dto, file);
  }
}
