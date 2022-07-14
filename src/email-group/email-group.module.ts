import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailGroupController } from './email-group.controller';
import { EmailGroupRepository } from './email-group.repository';
import { EmailGroupService } from './email-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailGroupRepository])],
  controllers: [EmailGroupController],
  providers: [EmailGroupService],
})
export class EmailGroupModule {}
