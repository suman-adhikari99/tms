import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMError } from 'typeorm';
import { ZipCodeRepository } from './zip-code.repository';
import { ZipCodesController } from './zip-codes.controller';
import { ZipCodesService } from './zip-codes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ZipCodeRepository])],
  controllers: [ZipCodesController],
  providers: [ZipCodesService],
})
export class ZipCodesModule {}
