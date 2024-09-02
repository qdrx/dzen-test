import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { CommentCreatedEvent } from './events/comment-created.event';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get('connect')
  async getNewComments(@Res() res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    this.eventEmitter.on('comment.created', (message: CommentCreatedEvent) => {
      res.write(`data: ${JSON.stringify(message.comment)} \n\n`);
    });
  }

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getComments() {
    return this.commentsService.getComments();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('search')
  async findCommentsByContent(@Query('content') content: string) {
    return this.commentsService.getCommentsByContent(content);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async createComment(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: CreateCommentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|gif|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.commentsService.createComment(user, dto, file);
  }
}
