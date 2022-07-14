import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Division {
  @IsOptional()
  @IsString()
  divisionName: string;

  @IsOptional()
  @IsArray()
  unitName: string[];
}

// export class Unit {
//   @IsOptional()
//   @IsString()
//   unitName: string;

//   @IsOptional()
//   @IsString()
//   departmentName: string;

//   @IsOptional()
//   @IsString()
//   divisionName: string;
// }

export class EditDivisionDto {
  // @IsOptional()
  // @IsString()
  // departmentName: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Division)
  division: Division[];

  // @IsOptional()
  // @IsArray()
  // @ValidateNested()
  // @Type(() => Unit)
  // unit: Unit[];
}
