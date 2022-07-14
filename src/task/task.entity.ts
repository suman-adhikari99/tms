import { Transform } from 'class-transformer';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { ISubTasks, ITeamMember, IJoinRequest, IStatus } from './interfaces';

@Entity({ name: 'tasks' })
export class Task {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  projectId: string;

  @Column()
  createdAt: string;

  @Column()
  assistanceRequestId: string;

  @Column()
  assistanceId: string;

  @Column()
  taskType: string;

  @Column()
  userId: string;

  @Column()
  deliverableFiles: Array<{
    uploadedBy: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: string;
    fileId: string;
    uploadedAt: string;
    uploadedTime: string;
  }>;

  @Column()
  documents: Array<{
    uploadedBy: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: string;
    fileId: string;
    uploadedAt: string;
    uploadedTime: string;
  }>;

  @Column()
  status: IStatus[];

  @Column()
  section: string;

  @Column()
  numberOfWords: string;

  @Index("taskTitle")
  @Column()
  title: string;

  @Column()
  JoinRequest?: IJoinRequest[];

  @Column()
  priority: string;

  @Column()
  taskCreatedDate: string;

  @Column()
  startDate: Date;

  @Column()
  dueDate: string;

  @Column()
  description: string;

  @Column()
  taskSetting: string;

  @Column()
  comment: Array<{
    message: string;
    document: Array<{
      uploadedBy: string;
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: string;
      fileId: string;
      uploadedAt: string;
      uploadedTime: string;
    }>;
    userId: string;
    image: string;
    commentBy: string;
    createdDate: string;
    role: string;
    fileId: string;
  }>;

  @Column()
  teamMember?: ITeamMember[];

  @Column()
  subTasks?: ISubTasks[];
}
