import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IFiles } from './interfaces';

@Entity({ name: 'group-channel' })
export class GroupChannel {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  channel: string;

  @Column()
  groupmembers: string[];

}
