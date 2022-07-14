import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderRepository } from 'src/orders/order.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { UserRepository } from 'src/users/user.repository';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [
    NotificationsModule,
    S3UploaderModule,
    TypeOrmModule.forFeature([
      TaskRepository,
      ProfileDataRepository,
      UserRepository,
      ProjectManagement,
      OrderRepository,
      ReviewOrderRepository,
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService]
})
export class TaskModule {}
