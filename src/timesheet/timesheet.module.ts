import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorTracksRepository } from 'src/contractor-tracks/contractor-tracks.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { UserRepository } from 'src/users/user.repository';
import { TimesheetController } from './timesheet.controller';
import { TimesheetService } from './timesheet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractorTracksRepository,
      UserRepository,
      EmployeeRepository,
    ]),
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService],
})
export class TimesheetModule {}
