import { Module } from '@nestjs/common';
import { InhouseService } from './inhouse.service';
import { InhouseController } from './inhouse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InHouseRepository } from './inhouse.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InHouseRepository])],

  controllers: [InhouseController],
  providers: [InhouseService],
})
export class InhouseModule {}
