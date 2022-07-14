import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountCouponRepository } from './discount-coupon.repository';

@Injectable()
export class DiscountCouponService {
    constructor(
        @InjectRepository(DiscountCouponRepository)
        private discountCouponRepository: DiscountCouponRepository
    ) { }

    getAllDiscountCoupon() {
        return this.discountCouponRepository.find();
    }

}
