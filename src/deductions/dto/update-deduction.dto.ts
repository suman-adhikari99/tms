import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class UpdateDeductionDto {
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
  @IsBoolean()
  deductionFrequency: boolean;

  @IsOptional()
  @IsString()
  amount: string;

  @IsOptional()
  @IsString()
  status: string;
}
