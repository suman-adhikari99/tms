import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'optional-services' })
export class OptionalService {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  serviceId: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  discountPercent: number;
}
