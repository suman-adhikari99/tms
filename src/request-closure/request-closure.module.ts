import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { NewFolderModule } from 'src/new-folder/new-folder.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { RequestClosureController } from './request-closure.controller';
import { RequestClosureRepository } from './request-closure.repository';
import { RequestClosureService } from './request-closure.service';

@Module({
  imports: [
    NotificationsModule,
    NewFolderModule,
    TypeOrmModule.forFeature([
      RequestClosureRepository,
      AssistanceRequestsRepository,
    ]),
  ],
  controllers: [RequestClosureController],
  providers: [RequestClosureService],
})
export class RequestClosureModule {}
