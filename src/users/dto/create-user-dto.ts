import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
// import { ContractorUser } from '../interfaces';

export class Roles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsArray()
  savedBy: string[];

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsBoolean()
  @IsOptional()
  isFirstTime: boolean;

  // @IsOptional()
  // @IsObject()
  // @ValidateNested()
  // @Type(() => ContractorUser)
  // contractorUser: ContractorUser;
}
