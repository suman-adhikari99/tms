import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

export interface IWorkTime {
  clockInTime: string;
  clockOutTime?: string;
}

export interface IBreakTime {
  breakStartTime: string;
  breakEndTime?: string;
}

export interface ITrackInfo {
  id?: string;
  userId?: string;
  date?: string;
  workingTime: IWorkTime[];
  breakTime?: IBreakTime[];
}

export interface ITrackReport {
  employeeId?: string;
  userId?: string; 
  date?: string;
  employeeName?: string;
  employmentType?: string;
  image?: string;
  workingTime?: IWorkTime[];
  trackedHours?: string;
  totalBreak: string;
  totalWorkedHours: string;
  prescribedHours?: string;
  overtime?: string;
}

export class WorkTime implements IWorkTime {
  @IsString()
  clockInTime: string;

  @IsString()
  clockOutTime?: string;
}

export class BreakTime implements IBreakTime {
  @IsString()
  breakStartTime: string;

  @IsString()
  breakEndTime?: string;
}

export class TrackInfo implements ITrackInfo {
  @IsString()
  id?: string;

  @IsString()
  userId: string;

  @IsString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkTime)
  workingTime: WorkTime[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakTime)
  breakTime?: BreakTime[];
}

export class TrackReport implements ITrackReport {
  @IsString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkTime)
  workingTime: WorkTime[];

  @IsString()
  trackedHours: string;

  @IsString()
  totalBreak: string;

  @IsString()
  totalWorkedHours: string;

  @IsString()
  prescribedHours: string;

  @IsString()
  overtime: string;
}
