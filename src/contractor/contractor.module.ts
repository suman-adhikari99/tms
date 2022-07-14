import { Module } from '@nestjs/common';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractorRepository } from 'src/contractor/contractor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ContractorRepository])],
  controllers: [ContractorController],
  providers: [ContractorService],
})
export class ContractorModule {}
