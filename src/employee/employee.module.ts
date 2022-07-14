import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';

@Module({
  imports: [
    MailModule,
    S3UploaderModule,
    TypeOrmModule.forFeature([EmployeeRepository]),
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports:[EmployeeService]
})
export class EmployeeModule {}
