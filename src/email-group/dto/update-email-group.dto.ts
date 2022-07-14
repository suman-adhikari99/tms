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

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Roles)
  role: Roles;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  userId: string;
}

export class UpdateEmailGroupDto {
  @IsOptional()
  @IsString()
  groupName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => GroupMember)
  groupMember: GroupMember[];
}
