import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
export class Name {
  @IsString()
  first: string;

  @IsString()
  last: string;
}

export class Names {
  @IsObject()
  @ValidateNested()
  english: Name;

  @IsObject()
  @ValidateNested()
  japanese: Name;
}

export class PersonalInformation {
  @IsObject()
  name: Names;

  @IsString()
  title: string;

  @IsString()
  email: string;

  @IsNumber()
  telephoneNumber: number;
}

export class EditClientDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInformation)
  personalInformation: PersonalInformation;
}
