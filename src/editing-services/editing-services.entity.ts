import { Transform } from 'class-transformer';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { IRows } from './interfaces';

@Entity({ name: 'editingServices' })
export class EditingServices {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: ObjectID;

  @Column()
  rowReference: Array<{
    title: string;
    order: string;
  }>;

  @Column()
  table: Array<{
    title: string;
    price: string;
    points: string[];
    link: string;
    rows: IRows[];
  }>;
}
