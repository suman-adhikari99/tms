import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionalServiceRepository } from './optional-service.repository';
import { OptionalServicesController } from './optional-services.controller';
import { OptionalServicesService } from './optional-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([OptionalServiceRepository])],
  controllers: [OptionalServicesController],
  providers: [OptionalServicesService]
})
export class OptionalServicesModule { }
