import { Controller, Get } from '@nestjs/common';
import { DiscountCouponService } from './discount-coupon.service';

@Controller('discount-coupon')
export class DiscountCouponController {
  constructor(private discountCouponService: DiscountCouponService) { }

  @Get()
  getAllDiscountCoupon() {
    return this.discountCouponService.getAllDiscountCoupon();
  }

}
