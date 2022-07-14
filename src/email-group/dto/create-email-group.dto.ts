import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Roles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}
export class GroupMember {
  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  userId: string;
}

export class EmailGroupDto {
  @IsString()
  groupName: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested()
  @Type(() => GroupMember)
  groupMember: GroupMember[];
}
