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
export class UpdateBenefitDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  calculationType: string;

  @IsOptional()
  @IsString()
  amount: string;

  @IsOptional()
  @IsBoolean()
  taxable: boolean;

  @IsOptional()
  @IsString()
  status: string;
}
