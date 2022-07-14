import { Module } from '@nestjs/common';
import { PayRollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { PayrollRepository } from './payroll.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { TaskRepository } from 'src/task/task.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { TeamSummaryRepositry } from 'src/team-summary/team-summary.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { DeductionRepository } from 'src/deductions/deductions.repository';
import { BenefitRepository } from 'src/benefits/benefits.repository';
import { PayrollTeamsummaryRepository } from 'src/payroll-teamsummary/payroll-teamsummary.repository';
import { ContractorRepository } from 'src/contractor/contractor.repository';
import { EmployeeWorkModule } from 'src/employee-work/employee-work.module';

@Module({
  imports: [
    EmployeeWorkModule,
    TypeOrmModule.forFeature([
      PayrollTeamsummaryRepository,
      PayrollRepository,
      ProjectManagement,
      TaskRepository,
      EmployeeRepository,
      TeamSummaryRepositry,
      ProfileDataRepository,
      BenefitRepository,
      DeductionRepository,
      ContractorRepository
    ]),
  ],
  providers: [PayRollService],
  controllers: [PayrollController],
  exports: [PayRollService],
})
export class PayrollModule {}
