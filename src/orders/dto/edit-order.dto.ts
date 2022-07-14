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
import { IFeatures } from '../interfaces';

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

  @IsOptional()
  @IsString()
  uploadedAt: string;

  @IsOptional()
  @IsString()
  uploadedTime: string;
}

export class BillingAddress {
  @IsString()
  title: string;

  @IsString()
  billingType: string;

  @IsString()
  region: string;

  @IsString()
  departmentName: string;

  @IsString()
  invoiceAddress: string;

  @IsString()
  organizationName: string;

  @IsString()
  postalCode: string;

  @IsBoolean()
  default: boolean;
}

export class OptionalService {
  @IsString()
  id: string;

  @IsString()
  serviceId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  discountPercent: number;
}

export class Name {
  @IsString()
  first: string;

  @IsString()
  last: string;
}

export class Names {
  @IsObject()
  @ValidateNested()
  english: Name;

  @IsObject()
  @ValidateNested()
  japanese: Name;
}

export class PersonalInformation {
  @IsString()
  email: string;

  @IsString()
  telephoneNumber: string;

  @IsString()
  title: string;

  @IsObject()
  // @ValidateNested()
  name: Names;
}

class Service {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  cost: number;

  @IsString()
  icon: string;

  @IsNumber()
  availablePlans: number;
}

class Plan {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  plan: string;

  @IsOptional()
  @IsString()
  serviceId: string;

  @IsOptional()
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsArray()
  points: string[];
}

export class DeliveryPlan {
  @IsString()
  id: string;

  @IsString()
  serviceId: string;

  @IsOptional()
  @IsString()
  deliveryDate: string;

  @IsNumber()
  planSchedule: number;

  @IsNumber()
  cost: number;

  @IsString()
  @IsOptional()
  expressService: string; // greater than two days
}

export class EditOrderDto {
  @IsString()
  @IsOptional()
  status: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  manuscriptFile: ManuscriptFile[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  supportingDocuments: ManuscriptFile[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  billingAddress: BillingAddress;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => OptionalService)
  optionalServices: OptionalService[];

  @IsOptional()
  @IsArray()
  omissionSections: string[];

  @IsOptional()
  @IsString()
  omissionOtherSpecified: string;

  @IsOptional()
  @IsObject()
  feature: IFeatures;

  @IsOptional()
  @IsString()
  omissionOther: string;

  @IsOptional()
  @IsString()
  academicField: string;

  @IsOptional()
  @IsString()
  specialty: string;

  @IsOptional()
  @IsArray()
  editingPreferences: string[];

  @IsOptional()
  @IsArray()
  addOnServices: string[];

  @IsOptional()
  @IsString()
  documentType: string;

  @IsOptional()
  @IsString()
  deliveryDate: string;

  @IsOptional()
  @IsString()
  manuscriptPurpose: string;

  @IsOptional()
  @IsString()
  manuscriptType: string;

  @IsOptional()
  @IsString()
  journalTitle: string;

  @IsOptional()
  @IsString()
  specialRequest: string;

  @IsOptional()
  @IsNumber()
  totalServiceCost: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;

  @IsOptional()
  @IsObject()
  @Type(() => Service)
  service: Service;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Plan)
  plan: Plan;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DeliveryPlan)
  deliveryPlan: DeliveryPlan;

  @IsOptional()
  @IsString()
  editEntireDocument: string;

  @IsOptional()
  @IsNumber()
  wordCount: number;

  @IsOptional()
  @IsString()
  wordReduction20Percent: string;

  @IsOptional()
  @IsString()
  language: string;
}
