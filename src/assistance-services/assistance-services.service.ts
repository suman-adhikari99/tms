import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssistanceRequestsService } from 'src/assistance-requests/assistance-requests.service';
import { Order } from 'src/orders/order.entity';
import { OrderRepository } from 'src/orders/order.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { AssistanceServicesRepository } from './assistance-services.repository';
import { SaveAssistanceServicesDto } from './dto/save-assistance-services.dto';

@Injectable()
export class AssistanceServicesService {
  constructor(
    @InjectRepository(AssistanceServicesRepository)
    private assistanceServiceRepository: AssistanceServicesRepository,
    private orderRepository: OrderRepository,
    private assistanceRequest: AssistanceRequestsService,
    private userRepository: UserRepository,
  ) {}

  // async saveAssistanceService(
  //   assistanceService: SaveAssistanceServicesDto,
  //   user: User,
  // ) {
  //   const { orderId } = assistanceService;
  //   const order = await this.orderRepository.findOne(orderId);

  //   const assistance = await this.assistanceServiceRepository.findOne({
  //     where: {
  //       orderId: order.id.toString(),
  //     },
  //   });

  //   if (assistance) {
  //     throw new HttpException('Order already has an assistance service', 403);
  //   }
  //   const newAssistanceService = await this.assistanceServiceRepository.create({
  //     ...assistanceService,
  //     orderId: order.id.toString(),
  //     userId: user.id.toString(),
  //     date: new Date().toISOString(),
  //     status: [
  //       {
  //         date: new Date().toISOString(),
  //         status: 'pending',
  //         description: 'New order arrived. Send for confirmation',
  //       },
  //     ],
  //     title: order.journalTitle,
  //     billingAddress: order.billingAddress,
  //     personalInformation: order.personalInformation,
  //   });
  //   this.assistanceServiceRepository.save(newAssistanceService);
  //   return this.assistanceRequest.saveAssistanceRequest(newAssistanceService);
  // }

  async myAssistanceServices(user: User) {
    console.log(user);
    try {
      const assistanceService = await this.assistanceServiceRepository.find({
        where: { userId: user.id.toString() },
      });
      return assistanceService;
    } catch (e) {
      throw new NotFoundException('Assistance Service Not Found');
    }
  }

  async getAssistanceServiceById(id: string) {
    return await this.assistanceServiceRepository.findOne(id);
  }
}
