import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Division {
  @IsString()
  divisionName: string;

  @IsOptional()
  @IsString()
  divisionId: string;

  @IsOptional()
  @IsArray()
  unitName: string[];
}

export class CreateDepartmentDto {
  @IsOptional()
  @IsString()
  departmentName: string;

  @IsOptional()
  @IsString()
  departmentId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Division)
  division: Division[];
}
