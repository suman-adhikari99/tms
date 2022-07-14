import { Transform } from 'class-transformer';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { IProfileData } from './interface';

@Entity({ name: 'profile-data' })
export class ProfileData {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString())
  id: string;

  @Column()
  userId: string;

  @Column()
  employmentType: string;

  @Column()
  profileData: IProfileData;

  @Column()
  dob: string;

  @Column()
  preferredPronouns: string;

  @Column()
  nationality: string;

  @Column()
  maritalStatus: string;

  @Column()
  address: string;

  @Column()
  panNo: string;

  @Column()
  skills: Array<{
    text: string;
    level: number;
  }>;

  @Column()
  specialities: Array<{
    text: string;
    level: number;
  }>;

  @Column()
  workExperience: Array<{
    jobTitle: string;
    employer: string;
    location: string;
    startDate: string;
    endDate: string;
    isWorking: boolean;
  }>;

  @Column()
  education: Array<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    isEnrolled: boolean;
  }>;

  @Column()
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    swiftCode: string;
  };

  @Column()
  billingAddress: {
    title: string;
    fullName: string;
    govermentNumber: string;
    address: string;
    postalCode: string;
    region: string;
  };

  @Column()
  document: {
    contractWithSignature: Array<{
      uploadedBy: string;
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: string;
      fileId: string;
      uploadedAt: string;
      uploadedTime: string;
    }>;

    identityVerification: Array<{
      uploadedBy: string;
      fileName: string;
      filePath: string;
      fileType: string;
      fileSize: string;
      fileId: string;
      uploadedAt: string;
      uploadedTime: string;
    }>;
  };
}
