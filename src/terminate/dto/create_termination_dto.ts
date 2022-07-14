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
import { ReasonForTermination, ReconciliationForm } from '../interface';

export class CreateTerminationDto {
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  employeeId: string;

  @IsOptional()
  @IsString()
  dateOfSubmission: string;

  @IsString()
  effectiveWorkingDate: string;

  @IsString()
  submittedBy: string;

  @IsString()
  lastWorkingDateByEmployee: string;

  @IsString()
  terminationReason: string;

  @IsString()
  terminationDetails: string;

  @IsString()
  severanceDetails: string;

  @IsBoolean()
  rehireEligibility: boolean;

  @IsString()
  lastWorkingDateByAdmin: string;

  @IsString()
  lastPayrollDate: string;

  @IsArray()
  companyProperty: string[];

  @IsArray()
  exitCorrespondence: string[];

  @IsArray()
  terminationDocumentation: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ReasonForTermination)
  reasonForTermination: ReasonForTermination[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => ReconciliationForm)
  ReconciliationForm: ReconciliationForm[];
}
