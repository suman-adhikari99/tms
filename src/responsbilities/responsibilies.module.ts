import { Module } from '@nestjs/common';
import { ResponsibilityService } from './responsibilities.services'
import { ResponsibilityController } from './responsibilities.controllers'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponsibilityRepository } from './responsibilities.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ResponsibilityRepository])],
  providers: [ResponsibilityService],
  controllers: [ResponsibilityController],
})
export class ResponsibilityModule {}
