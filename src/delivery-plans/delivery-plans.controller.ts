import { Controller, Get, Param, Post } from '@nestjs/common';
import { DeliveryPlansService } from './delivery-plans.service';

@Controller('delivery-plans')
export class DeliveryPlansController {
  constructor(private deliveryPlansService: DeliveryPlansService) {}

  @Get()
  getAllDeliveryPlans() {
    return this.deliveryPlansService.getAllDeliveryPlans();
  }

  @Post()
  postDeliveryPlan() {
    return this.deliveryPlansService.getAllDeliveryPlans();
  }

  @Get('/:id')
  getAllDeliveryPlansByServiceId(@Param('id') id: string) {
    return this.deliveryPlansService.getDeliveryPlansByServiceId(id);
  }
}
