import { Transform } from 'class-transformer';
import { Roles } from 'src/users/interfaces';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'emailGroup' })
export class EmailGroup {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  groupName: string;

  @Column()
  description: string;

  @Column()
  createdBy: string;

  @Column()
  groupMember: Array<{
    fullName: string;
    imageUrl: string;
    role: Roles;
    email: string;
    userId: string;
  }>;
}
