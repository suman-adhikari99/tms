import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'tickets' })
export class Ticket {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  createdDate: string;

  @Column()
  orderId: string;

  @Column()
  status: string;

  @Column()
  bmId: string;

  @Column()
  cmId: string;

  @Column()
  message: string;

  // @Column()
  // activeRole: string;

  // @Column()
  // image: string;

  @Column()
  ticket: string;
}
