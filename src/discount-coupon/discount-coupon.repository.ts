import { EntityRepository, Repository } from "typeorm";
import { DiscountCoupon } from "./discount-coupon.entity";

@EntityRepository(DiscountCoupon)
export class DiscountCouponRepository extends Repository<DiscountCoupon>{ }