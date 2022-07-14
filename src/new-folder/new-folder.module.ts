import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { ProjectClosureRepository } from 'src/project-closure/project-closure.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { S3UploaderModule } from 'src/s3-uploader/s3-uploader.module';
import { NewFolderController } from './new-folder.controller';
import { NewFolderRepository } from './new-folder.repository';
import { NewFolderService } from './new-folder.service';

@Module({
  imports: [
    S3UploaderModule,
    TypeOrmModule.forFeature([
      ReviewOrderRepository,
      NewFolderRepository,
      ProjectManagement,
      OrderRepository,
      ProjectClosureRepository,
    ]),
  ],
  controllers: [NewFolderController],
  providers: [NewFolderService],
  exports: [NewFolderService],
})
export class NewFolderModule {}
