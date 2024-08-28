import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { FileService } from './file.service';
import { AuthType } from '../../iam/auth/enums/auth-type.enum';
import { Auth } from '../../iam/auth/decorators/auth.decorator';
import { Response } from 'express';

@Controller('comments/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Auth(AuthType.None)
  @Get('')
  getFile(@Query('filename') filename: string, @Res() res: Response) {
    const filePath = join(this.fileService.getFilePath(), filename);
    const resolvedPath = resolve(filePath);
    const allowedPath = resolve(this.fileService.getFilePath());

    if (!resolvedPath.startsWith(allowedPath)) {
      throw new BadRequestException('Invalid file path');
    }

    if (!existsSync(resolvedPath)) {
      throw new NotFoundException('File not found');
    }
    return res.sendFile(filePath);
  }
}
