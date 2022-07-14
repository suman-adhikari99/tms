import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { TaskRepository } from 'src/task/task.repository';
import { UserRepository } from 'src/users/user.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationsRepository,
      OrderRepository,
      UserRepository,
      ReviewOrderRepository,
      ProjectManagement,
      TaskRepository,
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
