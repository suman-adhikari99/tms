import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class CreateDeductionDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  calculationType: string;

  @IsBoolean()
  deductionFrequency: boolean;

  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  status: string;
}
