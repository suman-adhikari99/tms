import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomPackController } from './custom-pack.controller';
import { CustomPackRepository } from './custom-pack.repository';
import { CustomPackService } from './custom-pack.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomPackRepository])],
  controllers: [CustomPackController],
  providers: [CustomPackService],
})
export class CustomPackModule {}
