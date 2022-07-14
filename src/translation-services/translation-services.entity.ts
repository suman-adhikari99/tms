import { Transform } from 'class-transformer';
import { IRows } from 'src/editing-services/interfaces';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'translationServices' })
export class TranslationServices {
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
