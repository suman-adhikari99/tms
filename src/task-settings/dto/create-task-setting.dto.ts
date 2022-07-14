import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsString, IsOptional } from 'class-validator';
export class CreateTaskSettingDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
