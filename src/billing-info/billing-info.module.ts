import { Module } from '@nestjs/common';
import { BillingInfoService } from './billing-info.service';
import { BillingInfoController } from './billing-info.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingInfoRepository } from './billing-info.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BillingInfoRepository])],
  providers: [BillingInfoService],
  controllers: [BillingInfoController],
})
export class BillingInfoModule {}
