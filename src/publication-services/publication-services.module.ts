import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationServicesController } from './publication-services.controller';
import { PublicationSerViceRepository } from './publication-services.repository';
import { PublicationServicesService } from './publication-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationSerViceRepository])],
  controllers: [PublicationServicesController],
  providers: [PublicationServicesService],
})
export class PublicationServicesModule {}
