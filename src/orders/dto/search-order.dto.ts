import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchOrderDto {
  @IsString()
  @IsOptional()
  date: string;

  @IsOptional()
  @IsString()
  planId?: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsArray()
  @IsOptional()
  status: string[];

  // @IsNumber()
  // @IsOptional()
  // days: number;

  @IsString()
  @IsOptional()
  days: string;

  @IsString()
  @IsOptional()
  serviceType: string;

  @IsString()
  @IsOptional()
  deliveryType: string;

  @IsString()
  @IsOptional()
  servicePlan: string;
}
