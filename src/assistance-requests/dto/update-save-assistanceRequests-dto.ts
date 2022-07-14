import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IStatus } from 'src/task/interfaces';

import { BillingAddress } from 'src/clients/interface';
import { TeamMember } from 'src/task/interfaces';
import { OptionalManuscriptDocument } from '../interfaces';

export class Name {
  @IsOptional()
  @IsString()
  first: string;

  @IsOptional()
  @IsString()
  last: string;
}

export class Names {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  english: Name;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  japanese: Name;
}

export class PersonalInformation {
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  telephoneNumber: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsObject()
  name: Names;
}

// export class OptionalManuscriptDocument {
//   @IsString()
//   @IsOptional()
//   message: string;

//   @IsArray()
//   @IsOptional()
//   files: string[];
// }
export class ServiceDetail {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPercent: number;

  @IsOptional()
  @IsArray()
  list: string[];
}

// export class TeamMember {
//   @IsOptional()
//   @IsString()
//   userId: string;

//   @IsOptional()
//   @IsString()
//   name: string;

//   @IsOptional()
//   @IsString()
//   imageUrl: string;

//   @IsOptional()
//   @IsString()
//   role: string;

//   @IsOptional()
//   @IsBoolean()
//   isJoined: boolean;

//   @IsOptional()
//   @IsBoolean()
//   declined: boolean;

//   @IsOptional()
//   @IsString()
//   joinedDate: string;
// }

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

export class UpdateAssistanceRequestsDto {
  @IsOptional()
  @IsString()
  assistantType: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TeamMember)
  teamMember?: TeamMember[];

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

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  deliverableFiles: ManuscriptFile[];

  @IsOptional()
  @IsString()
  serviceType: string;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetail)
  serviceDetail: ServiceDetail;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionalManuscriptDocument)
  optionalManuscriptDocument: Array<OptionalManuscriptDocument>;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  billingAddress: BillingAddress;

  @IsOptional()
  @IsNumber()
  TotalCostNoVAT: number;

  @IsOptional()
  @IsString()
  discountTag: string;

  @IsOptional()
  @IsObject()
  @IsOptional()
  status: IStatus[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;
}

export class AddFileForAssistanceRequestDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalManuscriptDocument)
  activeDocument: OptionalManuscriptDocument;
}