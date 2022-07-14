import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export interface IDeliveryPlan {
  id: string;
  serviceId: string;
  planSchedule: number;
  cost: number;
}

export interface ITeamMember {
  taskId: string;
  taskTitle: string;
  userId: string;
  name: string;
  imageUrl: string;
  role: string;
  isJoined: boolean;
  joinedDate: string;
}

export class TeamMember implements ITeamMember {
  @IsOptional()
  @IsString()
  taskId: string;

  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  taskTitle: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsBoolean()
  isJoined: boolean;

  @IsOptional()
  @IsString()
  joinedDate: string;
}

export interface IProjectTeamMember {
  userId: string;
  name: string;
  imageUrl: string;
  role: string;
  isJoined: boolean;
  joinedDate: string;
}

export class ProjectTeamMember implements IProjectTeamMember {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsBoolean()
  isJoined: boolean;

  @IsOptional()
  @IsString()
  joinedDate: string;
}

export class DeliveryPlan implements IDeliveryPlan {
  @IsString()
  // @IsOptional()
  id: string;

  @IsString()
  // @IsOptional()
  serviceId: string;

  @IsNumber()
  // @IsOptional()
  planSchedule: number;

  @IsNumber()
  // @IsOptional()
  cost: number;
}
export interface IService {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  availablePlans: number;
}

export class Service implements IService {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  cost: number;

  @IsString()
  @IsOptional()
  icon: string;

  @IsNumber()
  @IsOptional()
  availablePlans: number;
}

export interface IPlan {
  id: string;
  plan: string;
  serviceId: string;
  cost: number;
  points: string[];
}

export class Plan implements IPlan {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  plan: string;

  @IsString()
  @IsOptional()
  serviceId: string;

  @IsNumber()
  @IsOptional()
  cost: number;

  @IsArray()
  @IsOptional()
  points: string[];
}
export class Specialities {
  @IsString()
  text: string;

  @IsNumber()
  level: number;
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
