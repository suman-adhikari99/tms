import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { UserRepository } from 'src/users/user.repository';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectManagement,
      UserRepository,
      EmployeeRepository,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
