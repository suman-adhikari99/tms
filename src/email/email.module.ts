import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailService } from './email.service';

@Module({
  imports: [S3UploaderModule, TypeOrmModule.forFeature([EmailRepository])],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
