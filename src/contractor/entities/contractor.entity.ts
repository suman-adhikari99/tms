import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { PaymentSpec } from '../interfaces';

@Entity({ name: 'contractor' })
export class Contractor {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  groupName: string;

  @Column()
  paymentSpec: Array<{
    taskSettingName: string;
    highPriorityPay: string;
    mediumPriorityPay: string;
    lowPriorityPay: string;
  }>;
}
