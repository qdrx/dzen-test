import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileService } from './file/file.service';
import { Comment } from './entities/comment.entity';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsRepository,
    private readonly fileService: FileService,
  ) {}

  async getComments() {
    return await this.commentRepo.find({
      relations: ['author', 'replyTo'],
    });
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
    comment.content = dto.content;
    comment.attachment = filename;
    comment.replyTo = dto.replyTo
      ? await this.commentRepo.findOne({ where: { id: dto.replyTo } })
      : null;
    return this.commentRepo.save(comment);
  }
}
