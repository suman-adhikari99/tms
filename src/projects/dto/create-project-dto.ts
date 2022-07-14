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
  DeliveryPlan,
  Plan,
  JoinRequest,
  Service,
  TeamMember,
  ProjectTeamMember,
} from '../interfaces';

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
export class CreateProjectDto {
  @IsOptional()
  @IsArray()
  JoinRequest: JoinRequest[];

  @IsString()
  @IsOptional()
  orderId: string;

  @IsString()
  @IsOptional()
  specialRequest: string;

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

  @IsNumber()
  @IsOptional()
  numberWords: number;

  @IsString()
  @IsOptional()
  deliverables: string;

  @IsString()
  instruction: string;

  @IsString()
  addNotes: string;

  @IsNumber()
  numberOfWords: number;

  @IsString()
  serviceType: string;

  // @IsArray()
  // @IsOptional()
  // instruction: string[];

  // @IsArray()
  // @IsOptional()
  // specialities: string[];

  @IsString()
  specialities: string;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => ActiveDocuments)
  activeDocuments: ActiveDocuments;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested()
  // @Type(() => ActiveDocuments)
  // activeDocuments: ActiveDocuments;

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => SupportingDocuments)
  supportingDocuments: SupportingDocuments;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested()
  // @Type(() => SupportingDocuments)
  // supportingDocuments: SupportingDocuments;

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

  // @ValidateNested()
  // @Type(() => DeliveryPlan)
  // deliveryPlan: DeliveryPlan;

  // @ValidateNested()
  // @IsOptional()
  // @Type(() => DeliveryPlan
  // deliveryPlan?: DeliveryPlan;

  // import { Attachments, TeamMember } from '../interfaces';

  // @ValidateNested()
  // @IsOptional()
  // @Type(() => TeamMember)
  // teamMember?: TeamMember;

  // @IsString()

  // deliveryDate: string;

  // @IsString()
  // priority: string;

  // @IsString()
  // assignmentType: string;

  // @IsArray()
  // @IsString({ each: true })
  // clientRequests: string[];

  // @IsString()
  // notes: string;

  // @IsString()
  // language: string;

  // @IsString()
  // deliverables: string;

  // @IsString()
  // activeDocumentLabel: string;

  // @IsString()
  // supportDocumentLabel: string;

  // @IsArray()
  // @ValidateNested()
  // @Type(() => Attachments)
  // attachments: Attachments;

  // @IsString()
  // memberAccess: string;

  // @IsString()
  // cm: string;
}

// @IsString()
// @IsOptional()
// status: string;

// export class DeliveryPlan {
//   @IsString()
//   id: string;

//   @IsString()
//   serviceId: string;

//   @IsNumber()
//   planSchedule: number;

//   @IsNumber()
//   cost: number;

//   @IsString()
//   @IsOptional()
//   expressService: string; // greater than two days
// }
