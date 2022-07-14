import { Module } from '@nestjs/common';
import { OrderDeliverablesService } from './order-deliverables.service';
import { OrderDeliverablesController } from './order-deliverables.controller';

@Module({
  providers: [OrderDeliverablesService],
  controllers: [OrderDeliverablesController]
})
export class OrderDeliverablesModule {}
