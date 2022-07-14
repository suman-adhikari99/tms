import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsString, IsOptional } from 'class-validator';
import { SubTasks, TeamMember, JoinRequest } from '../interfaces';
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

export class CreateTaskDto {
  @IsOptional()
  @IsArray()
  JoinRequest: JoinRequest[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => DeliverableFiles)
  documents: DeliverableFiles[];

  @IsString()
  @IsOptional()
  projectId: string;

  @IsString()
  @IsOptional()
  taskSetting: string;

  @IsString()
  @IsOptional()
  assistanceRequestId: string;

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
  section: string;

  @IsString()
  @IsOptional()
  numberOfWords: string;

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
  @IsOptional()
  @ValidateNested()
  @Type(() => TeamMember)
  teamMember?: TeamMember[];

  @IsString()
  @IsOptional()
  description: string;

  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // documents: string[];

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => SubTasks)
  subTasks: SubTasks[];
}
