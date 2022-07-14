import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverablesController } from './deliverables.controller';
import { DeliverablesRepository } from './deliverables.repository';
import { DeliverablesService } from './deliverables.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverablesRepository])],
  controllers: [DeliverablesController],
  providers: [DeliverablesService],
})
export class DeliverablesModule {}
