import { Transform } from 'class-transformer';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { IManuscriptFile } from './interface';

@Entity('new-folder')
export class NewFolder {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  projectId: string;

  @Column()
  orderId: string;

  @Column()
  assistanceRequestId: string;

  @Column()
  folderName: string;

  @Column()
  updatedDate: string;

  @Column()
  createdDate: string;

  @Index("fileName")
  @Column()
  manuscriptFile: IManuscriptFile[];
}
