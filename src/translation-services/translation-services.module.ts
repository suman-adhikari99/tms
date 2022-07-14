import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationServicesController } from './translation-services.controller';
import { TranslationServicesRepository } from './translation-services.repository';
import { TranslationServicesService } from './translation-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([TranslationServicesRepository])],
  controllers: [TranslationServicesController],
  providers: [TranslationServicesService],
})
export class TranslationServicesModule {}
