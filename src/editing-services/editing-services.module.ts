import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditingServicesController } from './editing-services.controller';
import { EditingServicesRepository } from './editing-services.repository';
import { EditingServicesService } from './editing-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([EditingServicesRepository])],
  controllers: [EditingServicesController],
  providers: [EditingServicesService],
})
export class EditingServicesModule {}
