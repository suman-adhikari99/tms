import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'responsibilities' })
export class Responsibility {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  responsibility: string;

  @Column()
  role: string;
}
