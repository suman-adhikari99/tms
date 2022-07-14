import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitRepository } from 'src/benefits/benefits.repository';
import { ContractorTracksModule } from 'src/contractor-tracks/contractor-tracks.module';
import { DeductionRepository } from 'src/deductions/deductions.repository';
import { InHouseRepository } from 'src/inhouse/inhouse.repository';
import { PayrollRepository } from 'src/payroll/payroll.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { PayrollTeamsummaryController } from './payroll-teamsummary.controller';
import { PayrollTeamsummaryRepository } from './payroll-teamsummary.repository';
import { PayrollTeamsummaryService } from './payroll-teamsummary.service';

@Module({
  imports: [
    ContractorTracksModule,
    TypeOrmModule.forFeature([
      PayrollTeamsummaryRepository,
      ProjectManagement,
      BenefitRepository,
      DeductionRepository,
      InHouseRepository,
      PayrollRepository,
    ]),
  ],
  controllers: [PayrollTeamsummaryController],
  providers: [PayrollTeamsummaryService],
  exports: [PayrollTeamsummaryService],
})
export class PayrollTeamsummaryModule {}
