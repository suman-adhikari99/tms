import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApplicationUser } from '../interfaces';

export class Roles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}

export class EditUserDto {
  // @IsOptional()
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsString()
  @IsOptional()
  rating: string;
  @IsString()
  @IsOptional()
  reviews: string;

  @IsString()
  @IsOptional()
  salutation: string;

  @IsArray()
  @IsOptional()
  specialization: string[];

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  newPassword: string;

  @IsString()
  @IsOptional()
  telephoneNumber: string;

  @IsString()
  @IsOptional()
  institutionName: string;

  @IsString()
  @IsOptional()
  departmentName: string;

  @IsString()
  @IsOptional()
  positionTitle: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationUser)
  applicationUser?: ApplicationUser;

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => ContractorUser)
  // contractorUser?: ContractorUser;
}
