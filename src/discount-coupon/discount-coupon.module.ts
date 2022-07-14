import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { DiscountCouponController } from './discount-coupon.controller';
import { DiscountCouponRepository } from './discount-coupon.repository';
import { DiscountCouponService } from './discount-coupon.service';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountCouponRepository]),
    UsersModule
  ],
  controllers: [DiscountCouponController],
  providers: [DiscountCouponService]
})
export class DiscountCouponModule { }
