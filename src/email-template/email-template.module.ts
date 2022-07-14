import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateController } from './email-template.controller';
import { EmailTemplateRepository } from './email-template.repository';
import { EmailTemplateService } from './email-template.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplateRepository])],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
})
export class EmailTemplateModule {}
