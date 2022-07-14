import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'deduction' })
export class Deduction {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  calculationType: string;

  @Column()
  deductionFrequency: boolean;

  @Column()
  amount: string;

  @Column()
  status: string;
}
