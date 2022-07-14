import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GuestService } from './guestUploader.service';

@Controller('gUploader')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: ParameterDecorator) {
    return this.guestService.upload(file);
  }
}
