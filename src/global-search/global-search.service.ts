import { Injectable } from '@nestjs/common';
import { AssistanceServicesRepository } from 'src/assistance-services/assistance-services.repository';
import { MessageRepository } from 'src/message/message.repository';
import { NewFolderRepository } from 'src/new-folder/new-folder.repository';
import { OrderRepository } from 'src/orders/order.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { SearchDto } from './dto/search-dto';

@Injectable()
export class GlobalSearchService {
  constructor(
    private reviewOrderRepository: ReviewOrderRepository,
    private messageRepository: MessageRepository,
    private orderRepository: OrderRepository,
    private newFolderRepository: NewFolderRepository,
    private assistanceServicesRepository: AssistanceServicesRepository,
  ) {}

  async globalSearch(searchDto: SearchDto) {
    const { searchWord } = searchDto;
    const searchRegex = new RegExp('^' + searchWord.slice(0, 3), 'i');

    const orders = await this.orderRepository.find({
      // select: ['id'],
      where: {
        journalTitle: searchRegex,
      },
    });

    const invoices = await this.reviewOrderRepository.find({
      // select: ['id'],
      where: {
        journalTitle: searchRegex,
        invoice: { $exists: true },
      },
    });

    const newFolderDocs = await this.newFolderRepository.find({
      select: ['manuscriptFile'],
      where: {
        'manuscriptFile.fileName': searchRegex,
      },
    });
    
    const reviewOrderDocs = await this.reviewOrderRepository.find({
      select: ['manuscriptFile'],
      where: {
        'manuscriptFile.fileName': searchRegex,
      },
    });
    
    const assistanceServicesDocs = await this.assistanceServicesRepository.find({
      select: ['optionalManuscriptDocument'],
      where: {
        'optionalManuscriptDocument.fileName': searchRegex,
      },
    });

    const deliverables = [
      ...newFolderDocs,
      ...reviewOrderDocs,
      ...assistanceServicesDocs,
    ];

    // involved messages only
    const message = await this.messageRepository.find({
      where: {
        message: searchRegex
      },
    });

    return { orders, invoices, deliverables, message };
  }
}
