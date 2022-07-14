import { Module } from '@nestjs/common';
import { DeductionsService } from './deductions.service';
import { DeductionsController } from './deductions.controller';
import { DeductionRepository } from './deductions.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeductionRepository])],
  controllers: [DeductionsController],
  providers: [DeductionsService],
})
export class DeductionsModule {}
