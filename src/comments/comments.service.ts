import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileService } from './file/file.service';
import { Comment } from './entities/comment.entity';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { ILike } from 'typeorm';
import * as sanitizeHtml from 'sanitize-html';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { SearchService } from '../search/search.service';
import { CommentCreatedEvent } from './events/comment-created.event';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsRepository,
    private readonly fileService: FileService,
    private eventEmitter: EventEmitter2,
    private readonly searchService: SearchService,
  ) {}

  async getCommentsByContent(content: string) {
    const foundMatches = await this.searchService.search('comments', {
      wildcard: { content: `*${content}*` },
    });
    let comments: Comment[] = foundMatches.hits.hits.map(
      (hit) => hit._source as Comment,
    );
    if (comments.length === 0) {
      comments = await this.commentRepo.find({
        where: { content: ILike(`%${content}%`) },
        relations: ['author', 'replyTo'],
        order: { created_at: 'ASC' },
      });
    }
    return await this.getCommentsTree(comments);
  }

  async getComments() {
    const comments = await this.commentRepo.find({
      relations: ['author', 'replyTo'],
      order: { created_at: 'ASC' },
    });
    return await this.getCommentsTree(comments);
  }

  async getCommentsTree(comments: Comment[]) {
    const commentMap = new Map<number, Comment>();

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      if (comment.replyTo) {
        const parentComment = commentMap.get(comment.replyTo.id);
        if (parentComment) {
          parentComment.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments.reverse();
  }

  async createComment(
    user: ActiveUserData,
    dto: CreateCommentDto,
    file?: Express.Multer.File,
  ) {
    let filename = null;
    if (file) {
      filename = await this.fileService.uploadFile(file);
    }
    const comment = new Comment();
    comment.author = user.sub;
    comment.content = this.sanitizeContent(dto.content);
    comment.attachment = filename;
    comment.replyTo = dto.replyTo
      ? await this.commentRepo.findOne({ where: { id: dto.replyTo } })
      : null;
    const newComment: Comment = await this.commentRepo.save(comment);
    this.eventEmitter.emit(
      'comment.created',
      new CommentCreatedEvent(newComment),
    );
    return newComment;
  }

  private sanitizeContent(content: string) {
    return sanitizeHtml(content, {
      allowedTags: ['a', 'code', 'i', 'strong'],
      allowedAttributes: {
        a: ['href', 'title'],
      },
      allowedSchemes: ['http', 'https'],
    });
  }

  @OnEvent('comment.created', { async: true })
  async handleCommentCreated(payload: CommentCreatedEvent) {
    await this.searchService.index('comments', payload.comment);
  }
}
