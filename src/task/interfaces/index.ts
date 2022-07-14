import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ObjectIdColumn } from 'typeorm';

export interface ISubTasks {
  id: string;
  details: string;
  dueDate: string;
  userId: string;
  completed: boolean;
}

export class SubTasks implements ISubTasks {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  details: string;

  @IsString()
  dueDate: string;

  @IsString()
  userId: string;

  @IsBoolean()
  completed: boolean;
}

export interface ITeamMember {
  name: string;
  userId: string;
  role: string;
  imageUrl: string;
  isJoined: boolean;
  joinedDate: string;
  invited: boolean;
  declined: boolean;
}

export class TeamMember implements ITeamMember {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsString()
  role: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsBoolean()
  isJoined: boolean;

  @IsOptional()
  @IsString()
  joinedDate: string;

  @IsOptional()
  @IsBoolean()
  invited: boolean;

  @IsOptional()
  @IsBoolean()
  declined: boolean;
}
export class Specialities {
  @IsString()
  text: string;

  @IsNumber()
  level: number;
}

export interface IStatus {
  date: string;
  mainStatus: string;
  subStatus: string;
  description: string;
}
export class Status implements IStatus {
  @IsString()
  @IsOptional()
  mainStatus: string;

  @IsString()
  @IsOptional()
  subStatus: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsString()
  @IsOptional()
  description: string;
}

export interface IJoinRequest {
  userId: string;
  name: string;
  role: string;
  position: string;
  employer: string;
  address: string;
  imageUrl: string;
  specialization: Specialities[];
}

export class JoinRequest implements IJoinRequest {
  @IsString()
  @IsOptional()
  userId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsOptional()
  employer: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsArray()
  @IsOptional()
  specialization: Specialities[];
}
