import {
  Controller,
  InternalServerErrorException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
const path = require('path');

import { v4 as uuid } from 'uuid';

const destination = path.join(process.cwd(), 'temp');

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination,
        filename: function (req, file, cb) {
          cb(null, uuid() + path.extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.fileService.uploadFile(file);
    } catch (e) {
      throw new InternalServerErrorException(e.message || e);
    }
  }
}
