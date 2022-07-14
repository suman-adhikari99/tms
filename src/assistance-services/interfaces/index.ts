import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface IOptionalManuscriptDocument {
  message: string;
  files: string[];
}

export interface IServiceDetail {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  discountPercent: number;
  list: string[];
}

export class ServiceDetail implements IServiceDetail {
  @IsString()
  id: string;

  @IsString()
  serviceId: string;

  @IsString()
  name: string;

  @IsString()
  price: number;

  @IsString()
  discountPercent: number;

  @IsArray()
  list: string[];
}

export class OptionalManuscriptDocument implements IOptionalManuscriptDocument {
  @IsString()
  @IsOptional()
  message: string;

  @IsArray()
  @IsOptional()
  files: string[];
}
