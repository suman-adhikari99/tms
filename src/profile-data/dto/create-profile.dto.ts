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
export class Roles {
  @IsString()
  activeRole: string;

  @IsArray()
  mainRoles: string[];
}
export class ProfileData {
  @IsOptional()
  @IsString()
  image: string;

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
  telephoneNumber: string;

  @IsString()
  institutionName: string;

  @IsString()
  departmentName: string;

  @IsString()
  positionTitle: string;

  @IsOptional()
  @IsArray()
  specialization: string[];

  @IsBoolean()
  isFirstTime: boolean;

  // @IsString()
  // applicationUser: string;
}

export class Skills {
  @IsString()
  text: string;

  @IsNumber()
  level: number;
}

export class Specialities {
  @IsString()
  text: string;

  @IsNumber()
  level: number;
}

export class WorkExperience {
  @IsString()
  jobTitle: string;

  @IsString()
  employer: string;

  @IsString()
  location: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsBoolean()
  isWorking: boolean;
}

export class Education {
  @IsString()
  school: string;

  @IsString()
  degree: string;

  @IsString()
  fieldOfStudy: string;

  @IsBoolean()
  isEnrolled: boolean;

  @IsString()
  location: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ProfileData)
  profileData: ProfileData;

  @IsString()
  dob: string;

  @IsString()
  preferredPronouns: string;

  @IsString()
  nationality: string;

  @IsString()
  maritalStatus: string;

  @IsString()
  address: string;

  @IsString()
  panNo: string;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Skills)
  skills: Skills[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Specialities)
  specialities: Specialities[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => WorkExperience)
  workExperience: WorkExperience[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => Education)
  education: Education[];

  @IsOptional()
  @IsObject()
  billingAddress: {
    title: string;
    fullName: string;
    govermentNumber: string;
    address: string;
    postalCode: string;
    region: string;
  };

  @IsOptional()
  @IsObject()
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
  };
}
