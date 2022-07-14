import { Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitRepository } from './benefits.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BenefitRepository])],
  controllers: [BenefitsController],
  providers: [BenefitsService],
  exports: [BenefitsService]
})
export class BenefitsModule {}
