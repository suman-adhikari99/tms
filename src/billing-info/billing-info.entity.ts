import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'billing-info' })
export class BillingInfo {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  title: string;

  @Column()
  billingType: string;

  @Column()
  organizationName: string;

  @Column()
  departmentName: string;

  @Column()
  invoiceAddress: string;

  @Column()
  postalCode: string;

  @Column()
  region: string;

  @Column()
  userId: string;

  @Column({
    default: false,
  })
  @IsOptional()
  default?: boolean;
}
