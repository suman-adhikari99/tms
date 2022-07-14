import { Module } from '@nestjs/common';
import { ProjectClosureService } from './project-closure.service';
import { ProjectClosureController } from './project-closure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectClosureRepository } from './project-closure.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { NewFolderModule } from 'src/new-folder/new-folder.module';
import { PayrollModule } from 'src/payroll/payroll.module';
import { EmployeeWorkModule } from 'src/employee-work/employee-work.module';
import { OrderRepository } from 'src/orders/order.repository';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';

@Module({
  imports: [
    NotificationsModule,
    NewFolderModule,
    PayrollModule,
    EmployeeWorkModule,
    TypeOrmModule.forFeature([
      ProjectClosureRepository,
      ProjectManagement,
      OrderRepository,
      NotificationsRepository,
      ReviewOrderRepository,
    ]),
  ],
  controllers: [ProjectClosureController],
  providers: [ProjectClosureService],
})
export class ProjectClosureModule {}
