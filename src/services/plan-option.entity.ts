import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'PlanOptions' })
export class PlanOption {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  name: string;

  @Column()
  planId?: string;

  @Column()
  options:
    | string[]
    | {
        [key: string]: string | number;
      };
}
