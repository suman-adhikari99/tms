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

// export class BillingAddress {
//   @IsString()
//   title: string;

//   @IsString()
//   billingType: string;

//   @IsString()
//   region: string;

//   @IsString()
//   departmentName: string;

//   @IsString()
//   invoiceAddress: string;

//   @IsString()
//   organizationName: string;

//   @IsString()
//   postalCode: string;

//   @IsBoolean()
//   default: boolean;
// }

// export class AddBillDto {
//   @IsOptional()
//   @IsArray()
//   billingAddress: BillingAddress[];
// }
export class ManuscriptFile {
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
  userId: string;
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
class Plan {
  @IsString()
  id: string;

  @IsString()
  plan: string;

  @IsString()
  serviceId: string;

  @IsNumber()
  cost: number;

  @IsArray()
  points: string[];
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
export class ReviewOrderDto {
  @IsString()
  @IsOptional()
  orderId: string;

  @IsString()
  @IsOptional()
  billingManagerId: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  quotationNumber: string;

  @IsString()
  documentLanguage: string;

  @IsString()
  authorName: string;

  @IsNumber()
  documentWordCount: number;

  @IsString()
  specialRequest: string;

  @IsString()
  supportDocTitle: string;

  @IsArray()
  sections: Array<{
    title: string;
    words: number;
  }>;

  @IsArray()
  omitSections: string[];

  @IsArray()
  optionalAdditionalServices: Array<{
    id: string;
    serviceId: string;
    name: string;
    price: number;
    discountPercent: 20;
  }>;

  @IsString()
  manuscriptOption: string;

  @IsString()
  journalURL: string;

  @IsString()
  manuscriptPurposeNotes: string;

  @IsString()
  academicField: string;

  @IsString()
  speciality: string;

  @IsObject()
  deliveryPlan: {
    id: string;
    serviceId: string;
    planSchedule: number;
    cost: number;
    expressService: string;
  };

  // @IsOptional()
  // @IsArray()
  // billingAddress: BillingAddress[];

  @IsObject()
  billingAddressReview: {
    id: string;
    title: string;
    billingType: string;
    organizationName: string;
    departmentName: string;
    invoiceAddress: string;
    postalCode: string;
    region: string;
    userId: string;
    default: boolean;
  };

  @IsArray()
  billingInfoTags: Array<{
    id: string;
    value: string;
  }>;

  @IsString()
  billingInfoNotes: string;

  @IsNumber()
  wordCount: number;

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalService)
  optionalServices: OptionalService[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  manuscriptFile: ManuscriptFile;

  @IsArray()
  @IsOptional()
  omissionSections: string[];

  @IsString()
  @IsOptional()
  omissionOther: string;

  @IsString()
  specialty: string;

  @IsArray()
  @IsOptional()
  editingPreferences: string[];

  @IsArray()
  @IsOptional()
  addOnServices: string[];

  @IsString()
  @IsOptional()
  documentType: string;

  @IsString()
  @IsOptional()
  deliveryDate: string;

  @IsString()
  manuscriptPurpose: string;

  @IsString()
  manuscriptType: string;

  @IsString()
  journalTitle: string;

  @IsNumber()
  totalServiceCost: number;

  @IsObject()
  @Type(() => Service)
  service: Service;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Plan)
  plan: Plan;

  @IsString()
  editEntireDocument: string;

  @IsString()
  wordReduction20Percent: string;

  @IsString()
  language: string;
}
