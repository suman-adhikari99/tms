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
import { IStatus } from 'src/task/interfaces';
import { BillingAddress } from 'src/clients/interface';
import { ProjectTeamMember } from 'src/projects/interfaces';
import { TeamMember } from 'src/task/interfaces';
import { OptionalManuscriptDocument } from '../interfaces';

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

// export class OptionalManuscriptDocument {
//   @IsString()
//   @IsOptional()
//   message: string;

//   @IsArray()
//   @IsOptional()
//   files: string[];
// }
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
//   @IsString()
//   joinedDate: string;
// }
export class SaveAssistanceRequestsDto {
  @IsOptional()
  @IsString()
  assistantType: string;

  @IsObject()
  @IsOptional()
  status: IStatus[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TeamMember)
  teamMember?: TeamMember[];

  @IsOptional()
  @IsString()
  serviceType: string;

  @IsString()
  query: string;

  @IsString()
  orderId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ServiceDetail)
  serviceDetail: ServiceDetail;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionalManuscriptDocument)
  optionalManuscriptDocument: Array<OptionalManuscriptDocument>;

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

// @IsOptional()
// @IsObject()
// @ValidateNested()
// @Type(() => PersonalInformation)
// personalInformation: PersonalInformation;

// export class Name {
//   @IsString()
//   first: string;

//   @IsString()
//   last: string;
// }

// export class Names {
//   @IsObject()
//   @ValidateNested()
//   english: Name;

//   @IsObject()
//   @ValidateNested()
//   japanese: Name;
// }

// export class PersonalInformation {
//   @IsObject()
//   name: Names;

//   @IsString()
//   title: string;

//   @IsString()
//   email: string;

//   @IsNumber()
//   telephoneNumber: number;
// }
