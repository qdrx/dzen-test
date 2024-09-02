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
import { Comment } from './entities/comment.entity';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { Auth } from '../iam/auth/decorators/auth.decorator';
import { AuthType } from '../iam/auth/enums/auth-type.enum';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Auth(AuthType.None)
  @Get('connect')
  @ApiOperation({ summary: 'Get new comments via Server-Sent Events (SSE)' })
  @ApiResponse({
    status: 200,
    description: 'Stream of new comments',
    content: {
      'text/event-stream': {
        schema: {
          type: 'string',
          example: 'data: {"id":1,"content":"This is a comment"} \n\n',
        },
      },
    },
  })
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

  @Auth(AuthType.None)
  @UseInterceptors(CacheInterceptor)
  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  async getComments(): Promise<Comment[]> {
    return this.commentsService.getComments();
  }

  @Auth(AuthType.None)
  @UseInterceptors(CacheInterceptor)
  @Get('search')
  @ApiOperation({ summary: 'Search comments by content (partial)' })
  async findCommentsByContent(@Query('content') content: string) {
    return this.commentsService.getCommentsByContent(content);
  }

  @Auth(AuthType.None)
  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: Comment,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create Comment DTO',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'This is <i>my</i> comment' },
        replyTo: {
          type: 'number',
          example: 1,
          description:
            'ID of the comment to reply to, if not valid returns null',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
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
  ): Promise<Comment> {
    return this.commentsService.createComment(user, dto, file);
  }
}
