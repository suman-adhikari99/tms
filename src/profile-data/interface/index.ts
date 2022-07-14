import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApplicationUser, IApplicationUser } from 'src/users/interfaces';
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

export interface IProfileData {
  role: Roles;
  fullName: string;
  email: string;
  telephoneNumber: string;
  institutionName: string;
  departmentName: string;
  specialization: string[];
  isFirstTime: boolean;
  // applicationUser: IApplicationUser;
}

export class ProfileData implements IProfileData {
  @IsString()
  id: string;

  @IsArray()
  role: Roles;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  telephoneNumber: string;

  @IsString()
  institutionName: string;

  @IsString()
  departmentName: string;

  @IsString()
  positionTitle: string;

  @IsArray()
  specialization: string[];

  @IsBoolean()
  isFirstTime: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => ApplicationUser)
  applicationUser?: ApplicationUser;
}
