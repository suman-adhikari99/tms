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

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  telephoneNumber: string;

  @IsOptional()
  @IsString()
  institutionName: string;

  @IsOptional()
  @IsString()
  departmentName: string;

  @IsOptional()
  @IsString()
  positionTitle: string;

  @IsOptional()
  @IsArray()
  specialization: string[];

  @IsOptional()
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

export class ManuscriptFile {
  @IsString()
  uploadedBy: string;

  @IsString()
  filePath: string;

  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsString()
  fileSize: string;

  @IsString()
  fileId: string;

  @IsString()
  uploadedAt: string;

  @IsString()
  uploadedTime: string;
}
export class Document {
  @IsArray()
  contractWithSignature: ManuscriptFile[];

  @IsArray()
  identityVerification: ManuscriptFile[];
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  role: string;

  // @IsObject()
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => Roles)
  // role: Roles;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileData)
  profileData: ProfileData;

  @IsOptional()
  @IsString()
  dob: string;

  @IsOptional()
  @IsString()
  preferredPronouns: string;

  @IsOptional()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  maritalStatus: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
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
  @ValidateNested()
  @IsObject()
  @Type(() => Document)
  document: Document;

  @IsOptional()
  @IsObject()
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
  };
}
