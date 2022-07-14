import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'emailTemplate' })
export class EmailTemplate {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  subject: string;

  @Column()
  content: string;

  @Column()
  createdDate: string;

  @Column()
  userId: string;
}
