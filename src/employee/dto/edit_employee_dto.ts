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
  // Notes,
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

export class Notes {
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

export class EditEmployeeDto {
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Notes)
  notes: Notes[];

  @IsOptional()
  @IsString()
  employmentType: string;

  @IsOptional()
  @IsString()
  prescribedTime: string;

  @IsOptional()
  @IsString()
  salutation: string;

  @IsOptional()
  @IsString()
  workEmail: string;

  @IsOptional()
  @IsString()
  personalEmail: string;

  @IsOptional()
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  department: string;

  @IsOptional()
  @IsString()
  division: string;

  @IsOptional()
  @IsArray()
  unit: string[];

  @IsOptional()
  @IsString()
  startDate: string;

  // @IsArray()
  // @ValidateNested()
  // @Type(() => Department)
  // department: Department[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested()
  // @Type(() => Notes)
  // notes: Notes[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsOptional()
  @IsArray()
  tasks: string[];

  @IsOptional()
  @ValidateNested()
  @IsArray()
  @Type(() => Disciplinary_Case)
  disciplinaryCase?: Disciplinary_Case[];

  @IsOptional()
  @IsArray()
  companyProperty: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SalaryDetails)
  salaryDetails: SalaryDetails;

  @IsOptional()
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

// import { Type } from 'class-transformer';
// import {
//   IsArray,
//   IsBoolean,
//   IsNumber,
//   IsObject,
//   IsOptional,
//   IsString,
//   ValidateNested,
// } from 'class-validator';
// import {
//   Department,
//   Disciplinary_Case,
//   Notes,
//   SalaryDetails,
// } from '../interfaces';
// import { ActiveDocuments } from './create_employee_dto';

// export class Roles {
//   @IsString()
//   activeRole: string;

//   @IsArray()
//   mainRoles: string[];
// }
// export class EditEmployeeDto {
//   @IsOptional()
//   @IsString()
//   employmentType: string;

//   @IsOptional()
//   @ValidateNested()
//   @IsObject()
//   @Type(() => Disciplinary_Case)
//   disciplinaryCase: Disciplinary_Case;

//   @IsOptional()
//   @ValidateNested()
//   @IsObject()
//   @Type(() => ActiveDocuments)
//   activeDocuments: ActiveDocuments;

//   @IsOptional()
//   @IsString()
//   Salutation: string;

//   @IsOptional()
//   @IsString()
//   fullName: string;

//   @IsOptional()
//   @IsString()
//   email: string;

//   @IsOptional()
//   @IsString()
//   startDate: string;

//   @IsOptional()
//   @IsArray()
//   @ValidateNested()
//   @Type(() => Department)
//   department: Department[];

//   @IsArray()
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => Roles)
//   role: Roles;

//   @IsOptional()
//   @IsArray()
//   tasks: string[];

//   @IsOptional()
//   @IsArray()
//   companyProperty: string[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested()
//   @Type(() => SalaryDetails)
//   salaryDetails: SalaryDetails[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested()
//   @Type(() => Notes)
//   notes: Notes[];

//   @IsOptional()
//   @IsString()
//   status: string;
// }
