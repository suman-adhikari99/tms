import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { OrderRepository } from 'src/orders/order.repository';
import { User } from './user.entity';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { Roles } from './interfaces';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { getObjectId } from 'src/utilities';

const logger = new Logger('Auth Service');

@Injectable()
export class AuthService {
  constructor(
    private orderRepository: OrderRepository,
    private reviewOrderRepository: ReviewOrderRepository,
    private s3UploaderService: S3UploaderService,
    private readonly jwtService: JwtService,
    private readonly UsersService: UsersService,
    @InjectRepository(ProfileDataRepository)
    private profileRepository: ProfileDataRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
  ) {}

  async login(
    email: string,
    password: string,
    rememberMe: boolean,
    response: Response,
  ) {
    logger.log(`User ${email} is trying to login`);
    const user = await this.UsersService.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User with email not found');
    }
    // not logged in
    const employee = await this.employeeRepository.findOne({
      where: { email: email },
    });

    if (employee) {
      if (employee.status === 'Archived') {
        throw new ForbiddenException('User is currently terminated');
      } else {
        const profile = await this.profileRepository.findOne({
          where: { userId: user.id.toString() },
        });
        console.log('>>>>', Object.values(profile));
        const { isFirstTime } = user;
        if (user.isFirstTime) {
          if (Object.values(profile).length === 0) {
            user.isFirstTime = true;
            await this.UsersService.firstUser(user);
          } else {
            user.isFirstTime = false;
            await this.UsersService.firstUser(user);
          }
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new BadRequestException('Invalid password');
        }

        const jwt = await this.jwtService.signAsync({ id: user.id });

        response.cookie('token', jwt, {
          expires: new Date(
            new Date().getTime() + 12 * 30 * 24 * 60 * 60 * 60 * 1000,
          ),
          httpOnly: true,

          // expires: new Date(new Date().getTime() + 30 * 60 * 60 * 1000),
        });

        user.isFirstTime = isFirstTime;

        return {
          token: jwt,
          user,
        };
      }
    } else {
      try {
        const profile = await this.profileRepository.find({
          where: { userId: user.id.toString() },
        });
        console.log('>>>>', profile);
        const { isFirstTime } = user;
        if (user.isFirstTime) {
          if (Object.values(profile).length === 0) {
            user.isFirstTime = true;
            await this.UsersService.firstUser(user);
          } else {
            user.isFirstTime = false;
            await this.UsersService.firstUser(user);
          }
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new BadRequestException('Invalid password');
        }

        const jwt = await this.jwtService.signAsync({ id: user.id });

        response.cookie('token', jwt, {
          expires: new Date(
            new Date().getTime() + 12 * 30 * 24 * 60 * 60 * 60 * 1000,
          ),
          httpOnly: true,
        });

        user.isFirstTime = isFirstTime;

        return {
          token: jwt,
          user,
        };
      } catch (error) {
        console.log('error >>>>', error);
        throw new BadRequestException('Error Login', error);
      }
    }
  }

  async logout(response: Response, user: User) {
    try {
      user.role.activeRole = user.role.mainRoles[0];
      let profileUser = await this.profileRepository.findOne({
        where: { userId: user.id.toString() },
      });

      profileUser.profileData.role.activeRole = user.role.mainRoles[0];
      await this.profileRepository.save(profileUser);
      await this.userRepository.save(user);

      response.clearCookie('token');

      return {
        message: 'Logout Success',
      };
    } catch (error) {
      console.log('Logout Failed error >>>>', error);
      throw new BadRequestException('Logout Failed');
    }
  }

  async migrateFiles(order, user) {
    order.forEach((element) => {
      // old path
      console.log(element);
      let manuscriptFiles = element.manuscriptFile || [];
      manuscriptFiles.forEach((file) => {
        let url = file.filePath;
        var parts = url.split('/');
        var prefix = '';
        for (let i = 0; i < 3; i++) {
          prefix += parts[i] + '/';
        }
        var postfix = '';
        for (let i = 3; i < parts.length; i++) {
          postfix += parts[i];
          if (i != parts.length - 1) postfix += '/';
        }
        var oldKey = postfix;
        var newKey = user.id + '/' + postfix;
        console.log(oldKey);
        console.log(newKey);
        file.filePath = prefix + newKey;
        element.userId = user.id.toString();
        // add personal information to user
        user.personalInformation = element.personalInformation;
        user.isFirstTime = true;
        element.manuscriptFile[0].uploadedBy = user.id.toString(); /////// this is not working
        console.log('Migrate Files element >>>>>>>', element);
        this.s3UploaderService.s3Movement(oldKey, newKey);
      });
      this.orderRepository.save(element);
      this.userRepository.save(user);
    });
  }

  async migrateFilesReview(reviewOrder, user) {
    const objectId = getObjectId(reviewOrder.id);
    const reviewOrd = await this.reviewOrderRepository.findOne(objectId);
    console.log('rvw >>', reviewOrd);
    reviewOrd.userId = user.id.toString();
    this.reviewOrderRepository.save(reviewOrd);
  }

  async migrateFilesEmployee(employee, user) {
    const objectId = getObjectId(employee.id);
    const emp = await this.employeeRepository.findOne(objectId);
    console.log('emp', emp);
    emp.userId = user.id.toString();
    this.employeeRepository.save(emp);
  }

  async signUp(email: string, password: string, role: Roles) {
    const existingUser = await this.UsersService.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await this.employeeRepository.findOne({
      where: { workEmail: email },
    });

    if (employee) {
      const user = await this.UsersService.createUser({
        email,
        password: hashedPassword,
        role: employee.role,
        fullName: employee.fullName,
        isFirstTime: true,
        savedBy: [],
      });
      try {
        const order = await this.orderRepository.find({
          where: { 'personalInformation.email': email },
        });
        if (!order) {
        } else {
          this.migrateFiles(order, user);
          this.migrateFilesEmployee(employee, user);
        }
      } catch (err) {
        console.log(err);
      }
      return {
        message: 'User created successfully',
      };
    } else {
      const user = await this.UsersService.createUser({
        email,
        password: hashedPassword,
        fullName: '',
        role: {
          mainRoles: ['CU'],
          activeRole: 'CU',
        },
        isFirstTime: true,
        savedBy: [],
      });
      try {
        const order = await this.orderRepository.find({
          where: { 'personalInformation.email': email },
        });
        if (!order) {
        } else {
          this.migrateFiles(order, user);
          this.migrateFilesReview(order, user);
          // this.migrateFilesEmployee(employee, user);
        }
      } catch (err) {
        console.log(err);
      }
      return {
        message: 'User created successfully',
      };
    }
  }

  async getRoleByAdmin(email: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { email: email },
      });
      let roleInstance: Roles;

      roleInstance = employee.role;
      if (roleInstance === undefined) {
        throw new NotFoundException(
          'Role format not correct in the EMployee database',
        );
      }
      return roleInstance;
    } catch {
      throw new BadRequestException(
        'Role format not correct in the EMployee database',
      );
    }
  }
}
