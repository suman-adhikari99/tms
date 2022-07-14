import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { ContractorTracksController } from './contractor-tracks.controller';
import { ContractorTracksRepository } from './contractor-tracks.repository';
import { ContractorTracksService } from './contractor-tracks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractorTracksRepository, EmployeeRepository]),
  ],
  controllers: [ContractorTracksController],
  providers: [ContractorTracksService],
  exports: [ContractorTracksService],
})
export class ContractorTracksModule {}
