// export { CreateProjectDto as EditProjectDto } from './create-project-dto';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DeliveryPlan, Plan, Service, ProjectTeamMember } from '../interfaces';

export class ManuscriptFile {
  @IsString()
  uploadedBy: string;

  @IsString()
  filePath: string;

  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsString()
  fileSize: string;

  @IsString()
  fileId: string;

  @IsString()
  uploadedAt: string;

  @IsString()
  uploadedTime: string;
}
export class ActiveDocuments {
  @IsOptional()
  @IsString()
  label: string;

  @IsArray()
  document: ManuscriptFile[];
}

export class SupportingDocuments {
  @IsOptional()
  @IsString()
  label: string;

  @IsArray()
  document: ManuscriptFile[];
}

export class EditProjectDto {
  @IsOptional()
  @IsArray()
  teamMember: ProjectTeamMember[];

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => ActiveDocuments)
  activeDocuments: ActiveDocuments;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => SupportingDocuments)
  supportingDocuments: SupportingDocuments;

  @IsString()
  @IsOptional()
  orderId: string;

  @IsOptional()
  @IsString()
  specialRequest: string;

  @IsString()
  @IsOptional()
  deliveryDate: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  tasks: string;

  @IsNumber()
  @IsOptional()
  editors: number;

  @IsString()
  @IsOptional()
  projectNumber: string;

  @IsString()
  @IsOptional()
  createdDate: string;

  @IsString()
  @IsOptional()
  priority: string;

  @IsString()
  @IsOptional()
  assignmentType: string;

  @IsString()
  @IsOptional()
  manuscriptType: string;

  @IsString()
  @IsOptional()
  manuscriptPurpose: string;

  @IsString()
  @IsOptional()
  targetJournalUrl: string;

  @IsString()
  @IsOptional()
  language: string;

  @IsNumber()
  @IsOptional()
  numberWords: number;

  @IsString()
  @IsOptional()
  deliverables: string;

  @IsOptional()
  @IsString()
  instruction: string;

  @IsOptional()
  @IsString()
  addNotes: string;

  @IsOptional()
  @IsNumber()
  numberOfWords: number;

  @IsOptional()
  @IsString()
  serviceType: string;

  // @IsArray()
  // @IsOptional()
  // instruction: string[];

  // @IsArray()
  // @IsOptional()
  // specialities: string[];

  @IsOptional()
  @IsString()
  specialities: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => Service)
  service?: Service;

  @ValidateNested()
  @IsOptional()
  @Type(() => Plan)
  plan?: Plan;

  @ValidateNested()
  @IsOptional()
  @Type(() => DeliveryPlan)
  deliveryPlan?: DeliveryPlan;
}
