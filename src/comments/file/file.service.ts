import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { customAlphabet } from 'nanoid';
import * as sharp from 'sharp';

@Injectable()
export class FileService {
  private readonly _filePath = path.join(__dirname, '../../..', 'uploads');
  private readonly _allowedImageTypes = ['jpg', 'png', 'gif'];

  async uploadFile(file: Express.Multer.File) {
    const fileNameParts = file.originalname.split('.');
    const fileExtension = fileNameParts[fileNameParts.length - 1];
    if (this._allowedImageTypes.includes(fileExtension)) {
      const { width, height } = await sharp(file.buffer).metadata();
      if (width > 320 || height > 240) {
        file.buffer = await sharp(file.buffer).resize(320, 240).toBuffer();
      }
    }
    const newFilename = await this.generateFileName();
    const filePath = path.join(
      this._filePath,
      newFilename + '.' + fileExtension,
    );
    fs.writeFile(filePath, file.buffer, (err) => {
      if (err) {
        console.log(err);
        throw new BadRequestException('Error saving file');
      }
    });
    return newFilename + '.' + fileExtension;
  }

  async generateFileName() {
    const nanoid = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      10,
    );
    return nanoid();
  }

  getFilePath() {
    return this._filePath;
  }

  async deleteFile(filename: string) {
    throw new Error('Not implemented');
  }
}
