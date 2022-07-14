import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistanceServicesRepository } from 'src/assistance-services/assistance-services.repository';
import { MessageRepository } from 'src/message/message.repository';
import { NewFolderRepository } from 'src/new-folder/new-folder.repository';
import { OrderRepository } from 'src/orders/order.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { GlobalSearchController } from './global-search.controller';
import { GlobalSearchService } from './global-search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      ReviewOrderRepository,
      MessageRepository,
      NewFolderRepository,
      AssistanceServicesRepository,
    ]),
  ],
  controllers: [GlobalSearchController],
  providers: [GlobalSearchService],
})
export class GlobalSearchModule {}
