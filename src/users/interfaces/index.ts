import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';

export interface IRoles {
  mainRoles: string[];
  activeRole: string;
}

export class Roles implements IRoles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}
export interface IApplicationUser {
  roleId: number;
  responsibility: string;
  skill: string;
  experience: string;
  specialization: string;
  contract: string;
  identity: string;
  payment: IPayment;
  other: Other;
}

export interface IOther {
  jobTitle: string;
  employer: string;
  location: string;
  startDate: string;
  endDate: string;
  education: string;
  availability: string[];
}

export interface IPayment {
  method: string;
  details: Details;
}

export interface IDetails {
  accountNumber: string;
  swiftCode: string;
  address: string;
  name: string;
  govtId: string;
  postalCode: string;
  region: string;
}

export interface IUserFeedback {
  rating: number;
  feedbackMessage: string;
  goodAt: string[];
  badAt: string[];
}

export class Details implements IDetails {
  @IsString()
  accountNumber: string;

  @IsString()
  swiftCode: string;

  @IsString()
  address: string;

  @IsString()
  name: string;

  @IsString()
  govtId: string;

  @IsString()
  postalCode: string;

  @IsString()
  region: string;
}

export class Payment implements IPayment {
  @IsString()
  method: string;

  @ValidateNested()
  @IsObject()
  @Type(() => Details)
  details: Details;
}

export class Other implements IOther {
  @IsString()
  jobTitle: string;

  @IsString()
  employer: string;

  @IsString()
  location: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  education: string;

  @IsString({ each: true })
  availability: string[];
}

export class ApplicationUser implements IApplicationUser {
  @IsNumber()
  roleId: number;

  @IsString()
  responsibility: string;

  @IsString()
  skill: string;

  @IsString()
  experience: string;

  @IsString()
  specialization: string;

  @IsString()
  contract: string;

  @IsString()
  identity: string;

  @ValidateNested()
  @IsObject()
  @Type(() => Payment)
  payment: Payment;

  @ValidateNested()
  @IsObject()
  @Type(() => Other)
  other: Other;
}

// export interface IContractorUser {
//   availableHours: string;
// }
// export class ContractorUser implements IContractorUser {
//   @IsString()
//   availableHours: string;
// }
