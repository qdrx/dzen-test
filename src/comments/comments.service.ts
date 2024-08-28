import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { FileService } from './file/file.service';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentRepo: CommentsRepository,
    private readonly fileService: FileService,
  ) {}

  async getComments() {
    return this.commentRepo.find();
  }

  async createComment(dto: CreateCommentDto, file?: Express.Multer.File) {
    let filename = null;
    if (file) {
      filename = await this.fileService.uploadFile(file);
    }
    const comment = this.commentRepo.create({
      ...dto,
      attachment: filename,
    });
    return this.commentRepo.save(comment);
  }
}
