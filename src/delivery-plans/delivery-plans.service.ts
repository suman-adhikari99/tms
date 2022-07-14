import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryPlansRepository } from './delivery-plans.repository';

@Injectable()
export class DeliveryPlansService {
  constructor(
    @InjectRepository(DeliveryPlansRepository)
    private deliveryPlansRepository: DeliveryPlansRepository,
  ) {}

  getAllDeliveryPlans() {
    return this.deliveryPlansRepository.find();
  }

  async getDeliveryPlansByServiceId(id: string) {
    try {
      const deliveryPlans = await this.deliveryPlansRepository.find({
        where: {
          serviceId: id,
        },
      });
      if (!deliveryPlans) {
        throw new NotFoundException(
          'Delivery Plans with given service id Not Found',
        );
      } else {
        return deliveryPlans;
      }
    } catch (error) {
      throw new NotFoundException('Delivery Plans Not Found');
    }
  }
}
