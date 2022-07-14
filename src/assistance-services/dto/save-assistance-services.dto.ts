import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BillingAddress } from 'src/clients/interface';
export class OptionalManuscriptDocument {
  @IsString()
  @IsOptional()
  message: string;

  @IsArray()
  @IsOptional()
  files: string[];
}
export class ServiceDetail {
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

  @IsArray()
  list: string[];
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
export class SaveAssistanceServicesDto {
  @IsOptional()
  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  assistantType: string;

  @IsString()
  serviceType: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetail)
  serviceDetail: ServiceDetail;

  @IsObject()
  @ValidateNested()
  @Type(() => OptionalManuscriptDocument)
  optionalManuscriptDocument: OptionalManuscriptDocument;

  @IsString()
  query: string;

  @IsObject()
  @ValidateNested()
  @Type(() => BillingAddress)
  billingAddress: BillingAddress;

  @IsNumber()
  TotalCostNoVAT: number;

  @IsString()
  discountTag: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;
}

// import { IsOptional, IsString } from 'class-validator';

// export class SaveAssistanceServicesDto {
//   @IsString()
//   @IsOptional()
//   orderId: string;

//   @IsString()
//   @IsOptional()
//   userId: string;

//   @IsString()
//   assistantType: string;

//   @IsString()
//   serviceType: string;

//   @IsString()
//   serviceDetail: string;

//   @IsString()
//   optionalManuscriptDocument: string;

//   @IsString()
//   query: string;

//   @IsString()
//   billingAddress: string;

//   @IsString()
//   TotalCostNoVAT: string;

//   @IsString()
//   discountTag: string;
// }
