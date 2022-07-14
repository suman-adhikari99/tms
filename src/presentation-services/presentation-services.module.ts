import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresentationServicesController } from './presentation-services.controller';
import { PresentationServiceRepository } from './presentation-services.repository';
import { PresentationServicesService } from './presentation-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([PresentationServiceRepository])],
  controllers: [PresentationServicesController],
  providers: [PresentationServicesService],
})
export class PresentationServicesModule {}
