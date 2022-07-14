import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  isObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  Department,
  Disciplinary_Case,
  Notes,
  SalaryDetails,
} from '../interfaces';

export class Roles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}
export class ManuscriptFile {
  @IsOptional()
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

export class CreateEmployeeDto {
  @IsString()
  employmentType: string;

  @IsOptional()
  @IsString()
  prescribedTime: string;

  @IsString()
  salutation: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsString()
  fullName: string;

  @IsString()
  workEmail: string;

  @IsString()
  personalEmail: string;

  @IsString()
  department: string;

  @IsString()
  division: string;

  @IsArray()
  unit: string[];

  @IsOptional()
  @IsString()
  startDate: string;

  // @IsArray()
  // @ValidateNested()
  // @Type(() => Department)
  // department: Department[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Notes)
  notes: Notes[];

  @IsObject()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsArray()
  tasks: string[];

  @IsOptional()
  @ValidateNested()
  @IsArray()
  @Type(() => Disciplinary_Case)
  disciplinaryCase: Disciplinary_Case[];

  @IsArray()
  companyProperty: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => SalaryDetails)
  salaryDetails: SalaryDetails;

  @IsArray()
  @ValidateNested()
  @Type(() => ManuscriptFile)
  document: ManuscriptFile[];

  // @IsOptional()
  // @ValidateNested()
  // @IsObject()
  // @Type(() => ActiveDocuments)
  // activeDocuments: ActiveDocuments;
}

export class ActiveDocuments {
  @IsString()
  label: string;

  @IsArray()
  document: ManuscriptFile[];
}
