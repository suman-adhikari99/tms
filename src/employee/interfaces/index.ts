import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
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
export interface IDisciplinary_Case {
  dateOfSubmission: string;
  disciplinaryAction: string;
  reasonsForDisciplinaryAction: string[];
  detailsOfOccurence: string;
  dateOfOccurence: string;
  correctiveAction: string;
  correctiveActionTimeFrame: string[];
  followUpDate: string;
  otherReasonsForDisciplinaryAction: string;
}

export class Disciplinary_Case implements IDisciplinary_Case {
  @IsString()
  dateOfSubmission: string;

  @IsArray()
  reasonsForDisciplinaryAction: string[];

  @IsOptional()
  @IsArray()
  otherReasonsForDisciplinaryAction: string;

  @IsString()
  disciplinaryAction: string;

  @IsString()
  detailsOfOccurence: string;

  @IsString()
  dateOfOccurence: string;

  @IsString()
  correctiveAction: string;

  @IsArray()
  correctiveActionTimeFrame: string[];

  @IsString()
  followUpDate: string;
}

export interface ISalaryDetails {
  group: string;

  benefits: string[];
  deduction: string[];
}

export class SalaryDetails implements ISalaryDetails {
  @IsString()
  group: string;

  @IsString()
  @IsOptional()
  priority: string;

  @IsArray()
  benefits: string[];

  @IsArray()
  deduction: string[];
}
export interface INotes {
  title: string;
  description: string;
}

export class Notes implements INotes {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  createdDate: string;
}
export interface IDepartment {
  name: string;

  division: string[];
  unit: string[];
}

export class Department implements IDepartment {
  @IsOptional()
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  division: string[];

  @IsArray()
  @IsOptional()
  unit: string[];
}
