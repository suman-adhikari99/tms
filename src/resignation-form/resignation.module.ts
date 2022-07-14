import { Module } from '@nestjs/common';
import { ResignationService } from './resignation.service';
import { ResignationController } from './resignation.controller';
import { ResignationRepository } from './resignation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([ResignationRepository]),
  ],
  providers: [ResignationService],
  controllers: [ResignationController],
})
export class ResignationModule {}
