import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ClockInDto {
  @IsString()
  @IsNotEmpty()
  clockInTime: string;
}

export class ClockOutDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  clockInTime: string;

  @IsString()
  @IsNotEmpty()
  clockOutTime: string;
}

export class BreakStartDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  breakStartTime: string;
}

export class BreakEndDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  breakStartTime: string;

  @IsString()
  @IsNotEmpty()
  breakEndTime: string;
}
