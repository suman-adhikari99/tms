import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorRepository } from 'src/contractor/contractor.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { PayrollTeamsummaryModule } from 'src/payroll-teamsummary/payroll-teamsummary.module';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { TaskSettingRepository } from 'src/task-settings/task-settings.repository';
import { TaskRepository } from 'src/task/task.repository';

import { EmployeeWorkController } from './employee-work.controller';
import { EmployeeWorkRepository } from './employee-work.repository';
import { EmployeeWorkService } from './employee-work.service';

@Module({
  imports: [
    PayrollTeamsummaryModule,
    TypeOrmModule.forFeature([
      EmployeeWorkRepository,
      ProjectManagement,
      TaskRepository,
      EmployeeRepository,
      ContractorRepository,
      TaskSettingRepository,
    ]),
  ],
  controllers: [EmployeeWorkController],
  providers: [EmployeeWorkService],
  exports: [EmployeeWorkService],
})
export class EmployeeWorkModule {}
