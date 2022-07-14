import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPlansController } from './delivery-plans.controller';
import { DeliveryPlansRepository } from './delivery-plans.repository';
import { DeliveryPlansService } from './delivery-plans.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryPlansRepository])],
  controllers: [DeliveryPlansController],
  providers: [DeliveryPlansService]
})
export class DeliveryPlansModule { }
