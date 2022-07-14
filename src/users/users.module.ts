import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { CurrentUserInterceptor } from 'src/interceptors/current-user.interceptor';
import { MailModule } from 'src/mail/mail.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { OrderRepository } from 'src/orders/order.repository';
import { OrdersModule } from 'src/orders/orders.module';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { ReviewOrdersModule } from 'src/review-orders/review-orders.module';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { RoleRepository } from 'src/roles/role.repository';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { AuthService } from './auth.service';
import { ResetPasswordRepository } from './reset-password.repository';
import { UserRepository } from './user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [
    S3UploaderModule,
    NotificationsModule,
    ReviewOrdersModule,
    OrdersModule,
    EmployeeRepository,
    MailModule,
    TypeOrmModule.forFeature([
      ProfileDataRepository,
      UserRepository,
      EmployeeRepository,
      ResetPasswordRepository,
      RoleRepository,
      OrderRepository,
      ReviewOrderRepository,
      AssistanceRequestsRepository,
    ]),
    JwtModule.register({
      secret: 'key321',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
