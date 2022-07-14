import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'deliveryPlans' })
export class DeliveryPlans {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString)
  id: string;

  @Column()
  serviceId: string;

  @Column()
  date: string;

  @Column()
  planSchedule: number;

  @Column()
  cost: number;
}
