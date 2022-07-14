import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsArray,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { SubTasks, TeamMember } from '../interfaces';

export class ManuscriptFile {
  @IsOptional()
  @IsString()
  uploadedBy: string;

  @IsOptional()
  @IsString()
  filePath: string;

  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  fileType: string;

  @IsOptional()
  @IsString()
  fileSize: string;

  @IsOptional()
  @IsString()
  fileId: string;

  @IsString()
  uploadedAt: string;

  @IsString()
  uploadedTime: string;
}

export class Status {
  @IsString()
  @IsOptional()
  mainStatus: string;
  @IsString()
  @IsOptional()
  subStatus: string;

  @IsString()
  @IsOptional()
  date: string;
}
export class Comment {
  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  document: ManuscriptFile[];

  @IsOptional()
  @IsString()
  uploadedBy: string;

  @IsOptional()
  @IsString()
  commentBy: string;

  @IsOptional()
  @IsString()
  createdDate: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  fileId: string;
}

export class DeliverableFiles {
  @IsOptional()
  @IsString()
  uploadedBy: string;

  @IsOptional()
  @IsString()
  filePath: string;

  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  fileType: string;

  @IsOptional()
  @IsString()
  fileSize: string;

  @IsOptional()
  @IsString()
  fileId: string;

  @IsString()
  uploadedAt: string;

  @IsString()
  uploadedTime: string;
}

export class EditTaskDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => DeliverableFiles)
  deliverableFiles: DeliverableFiles[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => DeliverableFiles)
  documents: DeliverableFiles[];

  @IsOptional()
  @ValidateNested()
  @IsArray()
  @Type(() => Comment)
  comment: Comment[];

  @IsString()
  @IsOptional()
  projectId: string;

  @IsString()
  @IsOptional()
  section: string;

  @IsString()
  @IsOptional()
  numberOfWords: string;

  @IsString()
  @IsOptional()
  userId: string;

  @ValidateNested()
  @IsArray()
  @Type(() => Status)
  @IsOptional()
  status: Status[];

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  priority: string;

  @IsString()
  @IsOptional()
  startDate: Date;

  @IsString()
  @IsOptional()
  dueDate: string;

  // @IsArray()
  // @IsString({ each: true })
  // members: string[];

  @ValidateNested()
  @IsOptional()
  @Type(() => TeamMember)
  teamMember?: TeamMember[];

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => SubTasks)
  subTasks: SubTasks;
}
