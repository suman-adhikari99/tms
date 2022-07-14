import { Transform } from 'class-transformer';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'services' })
export class Services {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  cost: string;

  @Column()
  icon: string;

  @Column()
  availablePlans: number;

  @Column()
  discountId: string;
}
