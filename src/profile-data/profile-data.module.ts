import { Module } from '@nestjs/common';
import { ProfileDataService } from './profile-data.service';
import { ProfileDataController } from './profile-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileDataRepository } from './profile-data.repository';
import { UserRepository } from 'src/users/user.repository';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsRepository } from 'src/notifications/notifications.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';

@Module({
  imports: [
    NotificationsModule,
    TypeOrmModule.forFeature([
      ProfileDataRepository,
      UserRepository,
      NotificationsRepository,
      EmployeeRepository,
    ]),
  ],
  providers: [ProfileDataService],
  controllers: [ProfileDataController],
})
export class ProfileDataModule {}
