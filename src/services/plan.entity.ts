import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'plans' })
export class Plan {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  plan: string;

  @Column()
  serviceId: string;

  @Column()
  cost: number;

  @Column()
  points: string[];

  @Column()
  feature: Array<{
    id: string;
    title: string;
    content: string;
    price: number;
  }>;
}
