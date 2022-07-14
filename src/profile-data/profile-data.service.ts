import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileData } from './profile-data.entity';
import { ProfileDataRepository } from './profile-data.repository';

@Injectable()
export class ProfileDataService {
  constructor(
    @InjectRepository(ProfileDataRepository)
    private readonly profileDataRepository: ProfileDataRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationsRepository,
    private readonly notificationService: NotificationsService,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  // update only profile data
  async updateProfile(
    id: string,
    newProfile: UpdateProfileDto,
    request: Request,
  ) {
    console.log('newProfile >>>>>>>>>>>>>>>', newProfile);
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');

    const { profileData, userId } = newProfile;

    // const employee=await this.employeeRepository.find

    // find profile data having userId
    const userInProfileData = await this.profileDataRepository.findOne({
      where: { userId: id },
    });

    console.log('userInProfileData', userInProfileData);

    let employee = await this.employeeRepository.findOne({
      where: { userId: id },
    });

    console.log('employee update while updating profile', employee);
    if (!userInProfileData) {
      const { profileData } = newProfile;
      const np = await this.profileDataRepository.create({
        ...newProfile,
        employmentType: employee.employmentType,
        userId: id,
        education: [],
        workExperience: [],
        document: {
          contractWithSignature: [],
          identityVerification: [],
        },
      });
      let objectId = getObjectId(np.userId);
      let user = await this.userRepository.findOne(objectId);

      if (user) {
        user.fullName = profileData.fullName;
        user.telephoneNumber = profileData.telephoneNumber;
        user.email = profileData.email;
        user.image = profileData.image;
        user.institutionName = profileData.institutionName;
        user.departmentName = profileData.departmentName;
        user.positionTitle = profileData.positionTitle;
        user.specialization = profileData.specialization;
        user.image = profileData.image;

        this.userRepository.save(user);
        this.profileDataRepository.save(np);
      }
      if (employee) {
        employee.fullName = profileData.fullName;
        employee.workEmail = profileData.email;
        employee.image = profileData.image;

        this.employeeRepository.save(employee);
      }
    } else {
      const objectId = getObjectId(id);
      const user = await this.userRepository.findOne(objectId);
      const pid = await this.profileDataRepository.findOne({
        where: { userId: objectId.toString() },
      });
      console.log('pid', pid);
      if (!pid) {
        throw new NotFoundException(`Profile with id ${userId} not found`);
      }
      pid.profileData = profileData;
      // pid.employmentType = employee.employmentType;
      user.fullName = profileData.fullName;
      user.telephoneNumber = profileData.telephoneNumber;
      user.email = profileData.email;
      user.image = profileData.image;
      user.institutionName = profileData.institutionName;
      user.departmentName = profileData.departmentName;
      user.positionTitle = profileData.positionTitle;
      user.specialization = profileData.specialization;

      this.profileDataRepository.save(pid);
      this.userRepository.save(user);
    }
  } // main function ends

  // add new role in profile data
  async addRole(id: string, newProfile: UpdateProfileDto) {
    const { role } = newProfile;
    console.log('role >>>', role);
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    console.log('user >>>', user);
    user.requestedRole.push(role);
    this.userRepository.save(user);

    const pid = await this.profileDataRepository.findOne({
      where: { userId: id },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    this.notificationService.sendNotificationForRole(pid, role);
  }

  // approve the role
  async approveRole(id: string, nId: string) {
    const objectId = getObjectId(nId);
    const notification = await this.notificationRepository.findOne(objectId);
    if (!notification) throw new NotFoundException('Notification not found');
    const pid = await this.profileDataRepository.findOne({
      where: { userId: id },
    });
    if (!pid) throw new NotFoundException('Profile not found');

    // split role into array
    const roles = notification.role.split(',');

    // add role to profile data
    pid.profileData.role.mainRoles.push(...roles);
    let uniqueChars = [...new Set(pid.profileData.role.mainRoles)];
    console.log('uniqueChars', uniqueChars);
    pid.profileData.role.mainRoles = uniqueChars;
    console.log('pid >>>>>', pid);

    const obId = getObjectId(id);
    const user = await this.userRepository.findOne(obId);
    // find the role in user and remove that role
    const index = user.requestedRole.indexOf(notification.role);
    user.requestedRole.splice(index, 1);

    // pid.profileData.role.mainRoles.push(newProfile.role[i].mainRole);

    this.profileDataRepository.save(pid);
    this.userRepository.save(user);

    this.notificationService.sendAcceptNotificationRoleForUser(pid, nId);
  }

  async rejectRole(id: string, nId: string) {
    const pid = await this.profileDataRepository.findOne({
      where: { userId: id },
    });
    if (!pid) throw new NotFoundException('Profile not found');

    this.notificationService.sendRejectNotificationRoleForUser(pid, nId);
  }

  // edit particular index education
  async editEducation(
    ind: number,
    id: string,
    newProfile: UpdateProfileDto,
    request: Request,
  ) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');

    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    // remove given index education and replace newProfile
    pid.education.splice(ind, 1, newProfile.education[0]);
    // pid.education[ind] = newProfile.education[0];
    return this.profileDataRepository.save(pid);
  }

  // update only education and work experience
  async addEducation(
    id: string,
    newProfile: UpdateProfileDto,
    request: Request,
  ) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');

    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });

    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    for (let i = 0; i < newProfile.education.length; i++) {
      pid.education.push(newProfile.education[i]);
    }
    this.profileDataRepository.save(pid);
  }

  // update education of particular index
  async updateEducation(newEd: UpdateProfileDto, id: string, request: Request) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const { education } = newEd;
    const objectId = getObjectId(id);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    // replace the education with new education
    console.log('pid', pid);
    pid.education = education;

    return this.profileDataRepository.save(pid);
  }

  // delete particular index education
  async deleteEducation(ind: number, id: string, request: Request) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    console.log('index', ind);
    pid.education.splice(ind, 1);
    return this.profileDataRepository.save(pid);
  }

  async addWork(id: string, newProfile: UpdateProfileDto, request: Request) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    for (let i = 0; i < newProfile.workExperience.length; i++) {
      pid.workExperience.push(newProfile.workExperience[i]);
    }
    this.profileDataRepository.save(pid);
    // pid.workExperience.push(...newProfile.profileData);
  }

  // edit particular index work experience
  async editWork(
    ind: number,
    id: string,
    newProfile: UpdateProfileDto,
    request: Request,
  ) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    pid.workExperience.splice(ind, 1, newProfile.workExperience[0]);

    return await this.profileDataRepository.save(pid);
  }

  // delete particular index education
  async deleteWork(ind: number, id: string, request: Request) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    pid.workExperience.splice(ind, 1);
    return this.profileDataRepository.save(pid);
  }

  // update only payment info of profile data
  async updatePaymentInfo(
    id: string,
    newProfile: UpdateProfileDto,
    request: Request,
  ) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }

    pid.paymentInfo = newProfile.paymentInfo;
    user.paymentInfo = newProfile.paymentInfo;

    pid.billingAddress = newProfile.billingAddress;
    user.billingAddress = newProfile.billingAddress;

    this.profileDataRepository.save(pid);
    this.userRepository.save(user);
  }

  async updateDocument(
    id: string,
    newProfile: UpdateProfileDto,
    request: Request,
  ) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    const pid = await this.profileDataRepository.findOne({
      where: { userId: objectId.toString() },
    });
    if (!pid) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    pid.document.contractWithSignature =
      newProfile.document.contractWithSignature;
    pid.document.identityVerification =
      newProfile.document.identityVerification;

    this.profileDataRepository.save(pid);
    this.userRepository.save(user);
  }

  async getProfileById(user: User) {
    try {
      // const objectId = getObjectId(id);
      const profile = await this.profileDataRepository.findOne({
        where: { userId: user.id.toString() },
      });
      if (!profile) {
        throw new NotFoundException('Profile not found');
      } else {
        return profile;
      }
    } catch (err) {
      throw new NotFoundException('Profile not found catched');
    }
  }

  // get profile by userId
  async getProfileByUserId(id: string) {
    try {
      const profile = await this.profileDataRepository.findOne({
        where: { userId: id },
      });
      if (!profile) {
        throw new NotFoundException('Profile not found');
      } else {
        return profile;
      }
    } catch (err) {
      throw new NotFoundException('Profile not found catched');
    }
  }
}
