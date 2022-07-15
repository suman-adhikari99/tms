import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { DepartmentRepository } from 'src/department/department.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderRepository } from 'src/orders/order.repository';
import { PayrollTeamsummaryRepository } from 'src/payroll-teamsummary/payroll-teamsummary.repository';
import { PayrollRepository } from 'src/payroll/payroll.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { TerminateRepository } from 'src/terminate/terminate.repository';
import { UserRepository } from 'src/users/user.repository';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BenefitRepository } from 'src/benefits/benefits.repository';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { TaskModule } from 'src/task/task.module';
import { ProjectManagementModule } from 'src/projects/project-management.module';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { ReviewOrdersModule } from 'src/review-orders/review-orders.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PayrollModule } from 'src/payroll/payroll.module';

@Module({
  imports: [
    NotificationsModule,
    EmployeeModule,
    TaskModule,
    ProjectManagementModule,
    DashboardModule,
    ReviewOrdersModule,
    OrdersModule,
    PayrollModule,
    TypeOrmModule.forFeature([
      OrderRepository,
      ProjectManagement,
      UserRepository,
      ProfileDataRepository,
      AssistanceRequestsRepository,
      ReviewOrderRepository,
      EmployeeRepository,
      ReviewOrderRepository,
      TerminateRepository,
      PayrollRepository,
      DepartmentRepository,
      BenefitRepository,
      PayrollTeamsummaryRepository,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
