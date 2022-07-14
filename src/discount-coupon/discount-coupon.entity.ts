import { Transform } from 'class-transformer';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity({ name: 'discount-coupon' })
export class DiscountCoupon {
    @ObjectIdColumn()
    @Transform(({ value }) => value.toString)
    id: string;

    @Column()
    text: string;

    @Column()
    description: string;

    @Column()
    discountPercent: number;
}