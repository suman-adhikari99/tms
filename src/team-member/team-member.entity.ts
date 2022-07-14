import { Transform } from 'class-transformer';
import { ITeamMember } from 'src/projects/interfaces';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'team-member' })
export class TeamMember {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  teamMember?: ITeamMember[];

  // @Column()
  // projectId: string;

  // @Column()
  // userId: string;

  // @Column()
  // name: string;

  // @Column()
  // imageUrl: string;

  // @Column()
  // isJoined: boolean;

  // @Column()
  // role: string;

  // @Column()
  // joinedDate: string;
}
