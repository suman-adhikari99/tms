import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'taskSetting' })
export class TaskSetting {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;
}
