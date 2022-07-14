import {
  Body,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Res,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ObjectID } from 'mongodb';
import { getObjectId } from 'src/utilities';
import { CreateUserDto } from './dto/create-user-dto';
import { UserRepository } from './user.repository';
import { EditUserDto } from './dto/edit-user-dto';
import { ResetPasswordRepository } from './reset-password.repository';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { RoleRepository } from 'src/roles/role.repository';
import { User } from './user.entity';
import { ChangePasswordDto } from './dto/change-password-dto';
import { OrderRepository } from 'src/orders/order.repository';
import { SearchOrderDto } from 'src/orders/dto/search-order.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { ReviewOrdersService } from 'src/review-orders/review-orders.service';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { profile } from 'console';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { RateUser } from './dto/rate-user.dto';

const getHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(ResetPasswordRepository)
    private resetPasswordRepository: ResetPasswordRepository,
    private reviewOrderRepository: ReviewOrderRepository,
    private roleRepository: RoleRepository,
    private orderRepository: OrderRepository,
    private mailService: MailService,
    private notificationService: NotificationsService,
    private reviewOrdersService: ReviewOrdersService,
    private employeeRepository: EmployeeRepository,
    private assistanceRequestsRepository: AssistanceRequestsRepository,
    @InjectRepository(ProfileDataRepository)
    private profiledataRepository: ProfileDataRepository,
  ) {}

  async firstUser(user) {
    await this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
      // fullName: '',
      requestedRole: [],
      savedBy: [],
      // contractorUser: {},
    });

    return this.userRepository.save(newUser);
  }

  async editUser(editUserDto: EditUserDto, id: string) {
    let { password } = editUserDto;
    let user = this.userRepository.findOne({ id });

    const hashedPassword = getHashedPassword(password);
    password = hashedPassword.toString();
    user = {
      ...user,
      ...editUserDto,
    };

    this.userRepository.editUser(editUserDto, id);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, id: string) {
    try {
      const objectId = getObjectId(id);
      const user = await this.userRepository.findOne(objectId);

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { password, newPassword } = changePasswordDto;

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new BadRequestException('Invalid password');
      }

      // const hashedPassword = await getHashedPassword(password);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      changePasswordDto.password = hashedPassword;
      this.userRepository.changePassword(changePasswordDto, id);
    } catch (err) {
      console.log(err);
      throw new NotFoundException(err);
    }
  }

  async clientManager(searchOrderDto: SearchOrderDto) {
    if (Object.keys(searchOrderDto).length === 0) {
      return this.orderRepository.find();
    }
  }

  async acceptOrder(id: string, user: User) {
    try {
      if (user.role.activeRole !== 'CM') {
        throw new BadRequestException('You are not a client manager');
      }
      const objectId = getObjectId(id);
      const oId = await this.orderRepository.findOne(objectId);

      if (!oId) {
        throw new NotFoundException('Order Status type not found');
      } else {
        // (oId.quotationStatus = ''),
        console.log('.....................');
        oId.status.push({
          date: new Date().toISOString(),
          mainStatus: 'Order confirmed',
          subStatus: 'Order confirmed',
          description: 'Order Confirmed. Now order in progress.',
        });
        oId.status.push({
          date: new Date().toISOString(),
          mainStatus: 'Client manager joined',
          subStatus: 'Client manager joined',
          description: 'New Team Member joined the team.',
        });
        oId.status.push({
          date: new Date().toISOString(),
          mainStatus: 'Creating Project',
          subStatus: 'Creating Project',
          description: 'Project is being Created.',
        });

        console.log(oId);
        console.log('##########');
        await this.orderRepository.save(oId);
        let mId = user.id;

        this.notificationService.sendAcceptNotification(oId, mId);

        this.reviewOrdersService.acceptOrder(id, user);
      }
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async rejectOrder(id: string, user: User) {
    try {
      const { role } = user;
      if (role.activeRole !== 'CM') {
        throw new BadRequestException('You are not a client manager');
      }
      const objectId = getObjectId(id);
      const oId = await this.orderRepository.findOne(objectId);
      if (!oId) {
        throw new NotFoundException('Order not found');
      }
      const order = await this.orderRepository.find({
        where: { status: 'conforming order' },
      });
      if (!order) {
        throw new NotFoundException('Order Status type not found');
      } else {
        // oId.status = 'Order Cancelled';
        oId.status.push({
          date: new Date().toISOString(),
          mainStatus: 'Order Cancelled',
          subStatus: 'Order Cancelled',
          description: 'Order Rejected. Now order cancelled.',
        });
        await this.orderRepository.save(oId);
        let mId = user.id.toString();

        await this.notificationService.sendRejectNotification(oId, mId);
      }
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: string) {
    //mongo specific
    console.log('getUserById', id);
    try {
      const objectId = getObjectId(id);
      const user = await this.userRepository.findOne(objectId);
      if (!user) {
        throw new NotFoundException('User not found');
      } else {
        return user;
      }
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  findOne(id?: string) {
    console.log({
      id,
    });
    if (!id) {
      return null;
    }
    return this.userRepository.findOne(getObjectId(id));
  }

  async requestResetPassword(email: string, host: string) {
    console.log('host >>>>', host);
    //get user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    //check for existing reset password request
    const resetPassword = await this.resetPasswordRepository.find({
      where: { userId: user.id.toString() },
    });
    if (resetPassword) {
      await this.resetPasswordRepository.remove(resetPassword);
    }

    const restPasswordObject = this.resetPasswordRepository.create({
      userId: user.id.toString(),
    });
    const result = await this.resetPasswordRepository.save(restPasswordObject);
    const id = result.id.toString();

    console.log('host', host);

    const url = `${host}/reset-password/${id}`;

    await this.mailService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: `<a href="${url}">Reset Password</a>`,
    });

    return {
      message: 'We have sent you an email to reset your password',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { password, token } = resetPasswordDto;
    let resetPasswordObjectID: ObjectID;
    try {
      resetPasswordObjectID = getObjectId(token);
    } catch (error) {
      throw new NotFoundException('Invalid token');
    }
    const resetPassword = await this.resetPasswordRepository.findOne(
      resetPasswordObjectID,
    );
    let userObjectID: ObjectID;
    try {
      userObjectID = getObjectId(resetPassword.userId);
    } catch (error) {
      throw new NotFoundException('Invalid token');
    }
    const user = await this.userRepository.findOne(userObjectID);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const hashedPassword = await getHashedPassword(password);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    await this.resetPasswordRepository.remove(resetPassword);
    return {
      message: 'Password changed successfully',
    };
  }

  getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  // get all users whose role is CU
  getAllClientUsers() {
    return this.userRepository.find({
      where: { 'role.activeRole': 'CU' },
      // where: { role: { $elemMatch: { activeRole: 'CU' } } },
    });
  }

  async acceptAssistantRequest(id: string, user: User) {
    try {
      const { role } = user;
      if (role.activeRole !== 'CM') {
        throw new BadRequestException('You are not a client manager');
      }
      const objectId = getObjectId(id);
      const oId = await this.assistanceRequestsRepository.findOne(objectId);
      console.log('Ar >>> ', oId);
      if (!oId) {
        throw new NotFoundException('Assistance Request not found');
      } else {
        if (oId.status[oId.status.length - 1].mainStatus === 'In Progress')
          // if (oId.status[oId.status.length - 1].status === 'In Progress')
          throw new BadRequestException('Assistant already in progress');

        oId.status.push({
          mainStatus: 'In progress',
          subStatus: 'In progress',
          date: new Date().toISOString(),
          description: 'Assistant Request Accepted',
          // date: new Date().toISOString(),
          // status: 'In Progress',
          // description: 'Assistance Request Accepted.',
        });
        this.assistanceRequestsRepository.save(oId);
        this.notificationService.assistanceRequestAccept(
          oId,
          user.id.toString(),
        );
      }
    } catch (err) {
      console.log('err >>> ', err);
      throw new NotFoundException(err);
    }
  }

  async rejectAssistantRequest(id: string, user) {
    try {
      const { role } = user;
      if (role.activeRole !== 'CM') {
        throw new BadRequestException('You are not a client manager');
      }
      const objectId = getObjectId(id);
      const oId = await this.assistanceRequestsRepository.findOne(objectId);
      if (!oId) {
        throw new NotFoundException('Request not found');
      } else {
        if (oId.status[1].mainStatus === 'Rejected')
          throw new BadRequestException('Already rejected');
        oId.status.push({
          date: new Date().toISOString(),
          mainStatus: 'Rejected',
          subStatus: 'Rejected',
          description: 'Assistance Request Rejected.',
        });
        this.assistanceRequestsRepository.save(oId);
        this.notificationService.assistanceRequestReject(
          oId,
          user.id.toString(),
        );
      }
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async viewAsED(user: User) {
    try {
      let profile_user = await this.profiledataRepository.findOne({
        where: { userId: user.id.toString() },
      });
      if (profile_user) {
        console.log('profile_user >>> ', profile_user);
        profile_user.profileData.role.activeRole = 'ED';
        await this.profiledataRepository.save(profile_user);
        user.role.activeRole = 'ED';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      } else {
        user.role.activeRole = 'ED';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      }
    } catch (error) {
      console.log('Error in viewAsED', error);
      throw new NotFoundException('User not found');
    }
  }

  async viewAsQA(user: User) {
    try {
      let profile_user = await this.profiledataRepository.findOne({
        where: { userId: user.id.toString() },
      });
      if (profile_user) {
        console.log('profile_user >>> ', profile_user);
        profile_user.profileData.role.activeRole = 'QA';
        this.profiledataRepository.save(profile_user);
        user.role.activeRole = 'QA';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      } else {
        user.role.activeRole = 'QA';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      }
    } catch (error) {
      console.log('Error in viewAsED', error);
      throw new NotFoundException('User not found');
    }
  }

  async viewAsCM(user: User) {
    try {
      let profile_user = await this.profiledataRepository.findOne({
        where: { userId: user.id.toString() },
      });
      if (profile_user) {
        console.log('profile_user >>> ', profile_user);
        profile_user.profileData.role.activeRole = 'CM';
        this.profiledataRepository.save(profile_user);
        user.role.activeRole = 'CM';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      } else {
        user.role.activeRole = 'CM';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      }
    } catch (error) {
      console.log('Error in viewAsED', error);
      throw new NotFoundException('User not found');
    }
  }

  async viewAsCE(user: User) {
    try {
      let profile_user = await this.profiledataRepository.findOne({
        where: { userId: user.id.toString() },
      });
      if (profile_user) {
        console.log('profile_user >>> ', profile_user);
        profile_user.profileData.role.activeRole = 'CE';
        this.profiledataRepository.save(profile_user);
        user.role.activeRole = 'CE';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      } else {
        user.role.activeRole = 'CE';
        console.log(user.role.activeRole);
        await this.userRepository.save(user);
      }
    } catch (error) {
      console.log('Error in viewAsED', error);
      throw new NotFoundException('User not found');
    }
  }

  async getEditor() {
    try {
      const users = await this.userRepository.find({
        where: {
          'role.activeRole': { $ne: 'CU' },
        },
      });
      const allUsers = await Promise.all(
        users.map(async (user) => {
          let profile_user = await this.profiledataRepository.findOne({
            where: { userId: user.id.toString() },
          });
          let userInfo = {
            id: user.id.toString(),
            image: user.image,
            role: user.role,
            fullName: user.fullName,
            institutionName: user.institutionName,
            feedbacks: user.feedbacks,
            billingAddress: user.billingAddress.address,
            specialization: user.specialization,
            education: profile_user ? profile_user.education : [],
            experience: profile_user ? profile_user.workExperience : [],
            skills: profile_user ? profile_user.skills : [],
            positionTitle: user.positionTitle,
          };
          return userInfo;
        }),
      );
      return allUsers;
    } catch {
      throw new NotFoundException('User information not found to exist');
    }
  }

  async getEditorById(id: string) {
    try {
      const objectId = getObjectId(id);
      const user = await this.userRepository.findOne(objectId);
      const profile_user = await this.profiledataRepository.findOne({
        where: { userId: user.id.toString() },
      });

      let allUsers = [];
      let userInfo = {
        id: user.id.toString(),
        image: user.image,
        fullName: user.fullName,
        institutionName: user.institutionName,
        feedbacks: user.feedbacks,
        billingAddress: user.billingAddress.address,
        specialization: user.specialization,
        education: profile_user.education,
        experience: profile_user.workExperience,
        skills: profile_user.skills,
        positionTitle: user.positionTitle,
      };

      allUsers.push(userInfo);

      return allUsers;
    } catch {
      throw new NotFoundException(
        ' Specific User information not found to exist',
      );
    }
  }

  async getEditorReviewById(id: string) {
    try {
      const objectId = getObjectId(id);
      const user = await this.userRepository.findOne(objectId);

      if (!user)
        throw new BadRequestException(`User with user id ${id} not found`);

      return user.feedbacks;
    } catch {
      throw new NotFoundException('User information not found to exist');
    }
  }

  // find all users whose role is ED
  async findEditors() {
    try {
      const editors = await this.userRepository.find({
        where: {
          'role.mainRoles': { $in: ['ED'] },
        },
      });
      return editors;
    } catch {
      throw new NotFoundException('User information not found to exist');
    }
  }

  async me(user: User) {
    try {
      let all = {};
      const employee = await this.employeeRepository.findOne({
        where: { userId: user.id.toString() },
      });

      console.log('profileData >>> ', employee);

      // push user and profile data into all object
      all = user;
      all['employee'] = employee;

      // return Object.values(all);
      console.log('all >>> ', all);
      return all;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async rateUser(feedback: RateUser, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'CM' ||
        currentUser.role.activeRole === 'QA' ||
        currentUser.role.activeRole === 'CE'
      )
    )
      throw new ForbiddenException('Only client user can rate the orders.');

    const { userId } = feedback;
    const userObjectId = getObjectId(userId);

    const user = await this.userRepository.findOne(userObjectId);

    if (!user)
      throw new BadRequestException(`User with user id ${userId} not found`);

    if (!user.feedbacks) {
      user.feedbacks = [
        {
          rating: feedback.rating,
          feedbackMessage: feedback.feedbackMessage,
          goodAt: feedback.goodAt,
          badAt: feedback.badAt,
        },
      ];
    } else {
      user.feedbacks.push({
        rating: feedback.rating,
        feedbackMessage: feedback.feedbackMessage,
        goodAt: feedback.goodAt,
        badAt: feedback.badAt,
      });
    }

    return this.userRepository.save(user);
  }
}
