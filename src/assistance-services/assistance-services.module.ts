import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRequestsModule } from 'src/assistance-requests/assistance-requests.module';
import { OrderRepository } from 'src/orders/order.repository';
import { UserRepository } from 'src/users/user.repository';
import { AssistanceServicesController } from './assistance-services.controller';
import { AssistanceServicesRepository } from './assistance-services.repository';
import { AssistanceServicesService } from './assistance-services.service';

@Module({
  imports: [
    AssistanceRequestsModule,
    TypeOrmModule.forFeature([
      AssistanceServicesRepository,
      OrderRepository,
      UserRepository,
    ]),
  ],
  controllers: [AssistanceServicesController],
  providers: [AssistanceServicesService],
})
export class AssistanceServicesModule {}
