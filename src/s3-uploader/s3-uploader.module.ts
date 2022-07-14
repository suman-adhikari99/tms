import { Module } from '@nestjs/common';
import { GuestController } from './guestUploader.controller';
import { GuestService } from './guestUploader.service';
import { S3UploadController } from './s3-uploader.controller';
import { S3UploaderService } from './s3-uploader.service';

@Module({
  controllers: [S3UploadController, GuestController],
  providers: [S3UploaderService, GuestService],
  exports: [S3UploaderService],
})
export class S3UploaderModule {}
