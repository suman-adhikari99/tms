import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagementController } from './project-management.controller';
import { ProjectManagement } from './project-management.repository';
import { ProjectManagementService } from './project-management.service';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UsersModule } from 'src/users/users.module';
import { UserRepository } from 'src/users/user.repository';
import { OrderRepository } from 'src/orders/order.repository';
import { TeamSummaryRepositry } from 'src/team-summary/team-summary.repository';
import { TaskRepository } from 'src/task/task.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';

@Module({
  imports: [
    NotificationsModule,
    UsersModule,
    TypeOrmModule.forFeature([
      ProjectManagement,
      ProfileDataRepository,
      UserRepository,
      OrderRepository,
      TeamSummaryRepositry,
      TaskRepository,
      ReviewOrderRepository,
    ]),
  ],
  controllers: [ProjectManagementController],
  providers: [ProjectManagementService],
  exports: [ProjectManagementService]
})
export class ProjectManagementModule {}
