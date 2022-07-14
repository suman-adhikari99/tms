import { Module } from '@nestjs/common';
import { TaskSettingsService } from './task-settings.service';
import { TaskSettingsController } from './task-settings.controller';
import { TaskSettingRepository } from './task-settings.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TaskSettingRepository])],
  controllers: [TaskSettingsController],
  providers: [TaskSettingsService],
})
export class TaskSettingsModule {}
