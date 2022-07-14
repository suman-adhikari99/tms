import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IManuscriptFile } from 'src/project-closure/interface';
@Entity('projectClosure')
export class ProjectClosure {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  orderId: string;

  @Column()
  projectId: string;

  @Column()
  evaluationCertificate: IManuscriptFile;

  @Column()
  editorCertificate: IManuscriptFile;
}
