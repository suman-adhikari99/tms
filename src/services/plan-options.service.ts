import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanOptionRepository } from './plan-option.repository';
import { Logger } from '@nestjs/common';

const logger = new Logger('PlanOptionService');

@Injectable()
export class PlanOptionsService {
  constructor(
    @InjectRepository(PlanOptionRepository)
    private readonly planOptionRepository: PlanOptionRepository,
  ) {}

  getByPlanId(planId: string) {
    return this.planOptionRepository.find({
      where: {
        planId,
      },
    });
  }

  getAll() {
    return this.planOptionRepository.find();
  }

  getByPlanIds(planIds: string[]) {
    return this.planOptionRepository.find({
      where: {
        planId: {
          $in: planIds,
        },
      },
    });
  }
}
