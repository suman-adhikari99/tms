import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { IFiles, Roles } from './interfaces';

@Entity({ name: 'messages' })
export class Message {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  name: string;

  @Column()
  orderId: string;

  // @Column()
  // role: Roles;

  @Index("message")
  @Column()
  message: string;

  @Column()
  date: string;

  @Column()
  channel: string;

  @Column()
  creator: string;

  @Column()
  user: string;

  @Column()
  activeRole: string;

  @Column()
  image: string;

  @Column()
  seen: string[];

  @Column()
  @Optional()
  files: Array<IFiles>;
}
