import { Controller, Get } from '@nestjs/common';
import { OrderDeliverablesService } from './order-deliverables.service';

@Controller('order-deliverables')
export class OrderDeliverablesController {
  constructor(
    private readonly orderDeliverablesService: OrderDeliverablesService,
  ) {}

  @Get()
  getOrderDeliverables() {
    return this.orderDeliverablesService.orderDeliverables();
  }
}
