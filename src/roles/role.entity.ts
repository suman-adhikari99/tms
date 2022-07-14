import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ unique: true })
  role: string;
}
