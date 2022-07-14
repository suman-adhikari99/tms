import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { getObjectId } from 'src/utilities';
import { PlanRepository } from './plan.repository';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanRepository)
    private planRepository: PlanRepository,
  ) {}

  getAll() {
    return this.planRepository.find();
  }

  getPlansByServiceId(serviceId: string) {
    return this.planRepository.find({
      where: {
        serviceId,
      },
    });
  }

  async getById(id: string) {
    try {
      const objectId = getObjectId(id);
      const plan = await this.planRepository.findOne(objectId);
      if (!plan) {
        throw new NotFoundException('Plan not found');
      } else {
        return plan;
      }
    } catch (error) {
      throw new NotFoundException('Plan not found');
    }
  }
}
