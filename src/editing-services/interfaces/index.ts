import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export interface IRows {
  title: string;
  data: string[];
  eData: object;
}
export class Rows implements IRows {
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  data: string[];

  @IsOptional()
  @IsObject()
  eData: object;
}
