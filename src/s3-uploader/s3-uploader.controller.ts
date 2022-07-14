import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { S3UploaderService } from './s3-uploader.service';

@Controller('s3uploader')
@UseGuards(AuthGuard)
export class S3UploadController {
  constructor(private s3UploaderService: S3UploaderService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: ParameterDecorator, @CurrentUser() user: User) {
    return this.s3UploaderService.upload(file, user);
  }

  @Post('/delete')
  deleteFile(@Body() fileLink: string) {
    return this.s3UploaderService.deleteFile(fileLink);
  }

  @Post('/deleteFiles')
  deleteFiles(@Body() fileLink: object) {
    return this.s3UploaderService.deleteFiles(fileLink);
  }

  @Get('/download/:filename')
  downloadFile(@Param('filename') filename: string) {
    return this.s3UploaderService.downloadFile(filename);
  }

  @Get('files')
  fetchAllFiles() {
    return this.s3UploaderService.fetchAllFiles();
  }

  @Get('url/:filename')
  getUrl(@Param('filename') filename: string) {
    return this.s3UploaderService.getUrl(filename);
  }
}
