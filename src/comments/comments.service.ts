import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileService } from './file/file.service';
import { Comment } from './entities/comment.entity';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { ILike } from 'typeorm';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsRepository,
    private readonly fileService: FileService,
  ) {}

  async getCommentsByContent(content: string) {
    return await this.commentRepo.find({
      where: { content: ILike(`%${content}%`) },
      relations: ['author', 'replyTo'],
      order: { created_at: 'ASC' },
    });
  }

  async getComments() {
    const comments = await this.commentRepo.find({
      relations: ['author', 'replyTo'],
      order: { created_at: 'ASC' },
    });
    return await this.createCommentsTree(comments);
  }

  async createCommentsTree(comments: Comment[]) {
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

    return rootComments;
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
    return this.commentRepo.save(comment);
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
}
