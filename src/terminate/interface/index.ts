import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface IReasonForTermination {
  type: string;
  description: string;
}

export class ReasonForTermination implements IReasonForTermination {
  @IsString()
  type: string;

  @IsString()
  description: string;
}

export interface IReconciliationForm {
  lastWorkingDate: string;
  lastPayrollDate: string;
  company_property: Array<string>;
  exitCorrespondence: string;
  terminationDocumentation: string;
}

export class ReconciliationForm implements IReconciliationForm {
  @IsString()
  lastWorkingDate: string;

  @IsString()
  lastPayrollDate: string;

  @IsArray()
  company_property: Array<string>;

  @IsString()
  exitCorrespondence: string;

  @IsString()
  terminationDocumentation: string;
}
