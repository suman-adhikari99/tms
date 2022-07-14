import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailRepository } from 'src/email/email.repository';

@Module({
  imports: [S3UploaderModule, TypeOrmModule.forFeature([EmailRepository])],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
