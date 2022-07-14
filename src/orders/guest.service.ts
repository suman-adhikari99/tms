import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { getObjectId, getString } from 'src/utilities';
import { Connection } from 'typeorm';
import { PlaceOrderDto } from './dto/place-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrderRepository } from './order.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserRepository } from 'src/users/user.repository';

@Injectable()
export class GuestService {
  private orderRepository: OrderRepository;
  constructor(
    @InjectConnection() private connection: Connection,
    private notificationService: NotificationsService,
    private userRepository: UserRepository,
  ) {
    this.orderRepository = connection.getCustomRepository(OrderRepository);
  }

  // for Guest Order
  async createOrder(order: PlaceOrderDto) {
    const { email } = order.personalInformation;
    if (!email) {
      return 'Email is required';
    }
    const { deliveryPlan, manuscriptFile } = order;
    if (deliveryPlan.planSchedule <= 2) {
      deliveryPlan.expressService = 'Express Delivery'; // within 2 days is true
    } else {
      deliveryPlan.expressService = 'Standard Delivery'; // more than 2 days
    }

    let userId = '';

    // user with email
    const user = await this.userRepository.findOne({ email });
    if (user) {
      userId = user.id.toString();
    }

    const newOrder = this.orderRepository.create({
      ...order,
      supportingDocuments: order.supportingDocuments,
      userId,
      orderDate: new Date().toISOString(),
      manuscriptFile: manuscriptFile as unknown as [],
      status: [
        {
          mainStatus: 'Confirming Order',
          subStatus: 'Confirming Order',
          date: new Date().toISOString(),
          description: 'New order arrived. Send for confirmation',
        },
      ],
    });
    this.orderRepository.save(newOrder);
    this.notificationService.sendNewOrderNotification(newOrder);
  }
}

// import {
//   Injectable,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request } from 'express';
// import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/user.entity';
// import { getObjectId, getString } from 'src/utilities';
// import { Connection } from 'typeorm';
// import { PlaceOrderDto } from './dto/place-order.dto';
// import { SearchOrderDto } from './dto/search-order.dto';
// import { OrderRepository } from './order.repository';
// import { NotificationsService } from 'src/notifications/notifications.service';
// import { UserRepository } from 'src/users/user.repository';

// @Injectable()
// export class GuestService {
//   private orderRepository: OrderRepository;
//   constructor(
//     @InjectConnection() private connection: Connection,
//     private notificationService: NotificationsService,
//     private userRepository: UserRepository,
//   ) {
//     this.orderRepository = connection.getCustomRepository(OrderRepository);
//   }

//   // for Guest Order
//   async createOrder(order: PlaceOrderDto) {
//     const { email } = order.personalInformation;
//     if (!email) {
//       return 'Email is required';
//     }
//     const { deliveryPlan, manuscriptFile, personalInformation } = order;
//     if (deliveryPlan.planSchedule <= 2) {
//       deliveryPlan.expressService = 'Express Delivery'; // within 2 days is true
//     } else {
//       deliveryPlan.expressService = 'Standard Delivery'; // more than 2 days
//     }

//     let userId = '';

//     // user with email
//     const user = await this.userRepository.findOne({ email });
//     if (user) {
//       userId = user.id.toString();
//     }

//     const newOrder = this.orderRepository.create({
//       ...order,
//       userId,
//       // personalInformation: personalInformation,
//       orderDate: new Date().toISOString(),
//       manuscriptFile: manuscriptFile as unknown as [],
//       status: [
//         {
//           date: new Date().toISOString(),
//           status: 'confirming order',
//           description: 'New order arrived. Send for confirmation',
//         },
//       ],
//     });
//     await this.orderRepository.save(newOrder);
//     await this.notificationService.sendNewOrderNotification(newOrder);
//   }
// }
