import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindPeopleDto {
  @IsArray()
  task: string[];

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  userId: string;
}
