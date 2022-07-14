import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PlansService } from './plans.service';
import { PlanOptionsService } from './plan-options.service';
import { PlanOptionRepository } from './plan-option.repository';
import { PlanRepository } from './plan.repository';
import { ServicesRepository } from './services.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlanRepository,
      PlanOptionRepository,
      ServicesRepository,
    ]),
  ],
  providers: [ServicesService, PlansService, PlanOptionsService],
  controllers: [ServicesController],
})
export class ServicesModule {}
