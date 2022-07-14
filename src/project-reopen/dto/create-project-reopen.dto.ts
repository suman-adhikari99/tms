import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  JoinRequest,
  DeliveryPlan,
  Plan,
  Service,
  TeamMember,
  ProjectTeamMember,
} from 'src/projects/interfaces';

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
  @IsString()
  label: string;

  @IsArray()
  document: ManuscriptFile[];
}

export class SupportingDocuments {
  @IsString()
  label: string;

  @IsArray()
  document: ManuscriptFile[];
}
export class ProjectReopenDto {
  @IsOptional()
  @IsArray()
  JoinRequest: JoinRequest[];

  @IsString()
  projectId: string;

  @IsString()
  orderId: string;

  @IsOptional()
  @IsArray()
  teamMember: ProjectTeamMember[];

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

  @IsString()
  @IsOptional()
  deliverables: string;

  @IsOptional()
  @IsString()
  addNotes: string;

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

  @IsOptional()
  @IsBoolean()
  isOpen: boolean;
}
