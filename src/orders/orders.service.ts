import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectConnection } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { getObjectId, getString } from 'src/utilities';
import { Connection } from 'typeorm';
import { PlaceOrderDto } from './dto/place-order.dto';
import { SearchOrderDto } from './dto/search-order.dto';
import { OrderRepository } from './order.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserRepository } from 'src/users/user.repository';
import { EditOrderDto } from './dto/edit-order.dto';
import { RateOrder } from './dto/rate-order.dto';

@Injectable()
export class OrdersService {
  private orderRepository: OrderRepository;
  constructor(
    @InjectConnection() private connection: Connection,
    private notificationService: NotificationsService,
    private userRepository: UserRepository,
  ) {
    this.orderRepository = connection.getCustomRepository(OrderRepository);
  }

  async placeOrder(order: PlaceOrderDto, user: User) {
    const userId = getString(user.id);
    const {
      personalInformation,
      deliveryPlan,
      manuscriptFile,
      supportingDocuments,
      omissionOtherSpecified,
      wordCount,
    } = order;
    personalInformation
      ? (personalInformation.name.english.first = user.fullName)
      : '';

    personalInformation ? (personalInformation.email = user.email) : '';
    personalInformation
      ? // ? (personalInformation.telephoneNumber = parseFloat(user.telephoneNumber))
        (personalInformation.telephoneNumber = user.telephoneNumber)
      : '';
    if (deliveryPlan.planSchedule <= 2) {
      deliveryPlan.expressService = 'Express Delivery'; // within 2 days is true
    } else {
      deliveryPlan.expressService = 'Standard Delivery'; // more than 2 days
    }
    const newOrder = await this.orderRepository.create({
      ...order,
      supportingDocuments: supportingDocuments,
      omissionOtherSpecified: omissionOtherSpecified,
      orderDate: new Date().toISOString(),
      userId,
      manuscriptFile: manuscriptFile,
      status: [
        {
          mainStatus: 'Confirming Order',
          subStatus: 'Confirming Order',
          date: new Date().toISOString(),
          description: 'New order arrived. Send for confirmation',
        },
      ],

      // status: [
      //   {
      //     date: new Date().toISOString(),
      //     status: 'confirming order',
      //     description: 'New order arrived. Send for confirmation',
      //   },
      // ],
    });
    await this.orderRepository.save(newOrder);
    await this.notificationService.sendNewOrderNotification(newOrder);
  }

  async addManuscript(editOrder: EditOrderDto, oId: string) {
    try {
      const { manuscriptFile } = editOrder;

      const objectId = getObjectId(oId);
      const order = await this.orderRepository.findOne(objectId);

      if (!order) throw new NotFoundException('Order with given Id Not Found');

      for (let i = 0; i < manuscriptFile.length; i++) {
        order.manuscriptFile.push(manuscriptFile[i]);
      }

      this.orderRepository.save(order);
    } catch (err) {
      throw new NotFoundException('order Catch what Not Found');
    }
  }

  async addSupportingDocument(editOrder: EditOrderDto, id: string) {
    try {
      const { supportingDocuments } = editOrder;
      const objectId = getObjectId(id);
      const order = await this.orderRepository.findOne(objectId);

      if (!order) throw new NotFoundException('Order with given Id Not Found');
      else {
        // order.supportingDocuments = supportingDocuments;

        for (let i = 0; i < supportingDocuments.length; i++) {
          order.supportingDocuments.push(editOrder.supportingDocuments[i]);
        }
        this.orderRepository.save(order);
      }
    } catch (err) {
      console.log(err);
      throw new NotFoundException('Order Catch what Not Found');
    }
  }

  async myOrders(user: User, request: Request) {
    try {
      const cookie = request.cookies['token'];
      if (!cookie) throw new UnauthorizedException('No cookie found');
      if (!user) throw new NotFoundException('User Not Found');
      const order = await this.orderRepository.find({
        where: { userId: user.id.toString() },
      });
      return order;
      // const response = [];
      // for (let i = 0; i < order.length; i++) {
      //   const { reviewedBy } = order[i];
      //   let reviewBy = await this.userRepository.findOne(reviewedBy);
      //   response.push({ ...order[i], user: reviewBy });
      // }
      // return response;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async myOrdersEmail(user: User, request: Request) {
    try {
      const cookie = request.cookies['token'];
      if (!cookie) throw new UnauthorizedException('No cookie found');
      if (!user) throw new NotFoundException('User Not Found');
      const o = await this.orderRepository.find();

      for (let i = 0; i < o.length; i++) {
        const { personalInformation } = o[i];
        const order = await this.orderRepository.find({
          where: { personalInformation: { $elemMatch: { email: user.email } } },
          // where:{personalInformation['email'] : user.email},
        });
        return order;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async getOrderStatus(id: string) {
    const objectId = getObjectId(id);
    const order = await this.orderRepository.findOne(objectId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order.status;
  }

  async getOrderById(id: string) {
    try {
      const objectId = getObjectId(id);
      const order = await this.orderRepository.findOne(objectId);
      if (!order) {
        throw new NotFoundException('Order not found');
      } else {
        const { reviewedBy } = order;
        if (!reviewedBy) {
          return order;
        } else {
          const user = await this.userRepository.findOne(reviewedBy);
          return { order, user };
        }
      }
    } catch (error) {
      throw new NotFoundException('Order not found');
    }
  }

  async getOrders(searchOrderDto: SearchOrderDto, request: Request) {
    const cookie = request.cookies['token'];
    if (!cookie) throw new UnauthorizedException('No cookie found');
    let { days, serviceType, deliveryType, servicePlan } = searchOrderDto;

    // let gatey = g.toISOString();
    // if (Object.keys(searchOrderDto).length === 0) {
    const where = {};
    if (days) {
      let d = new Date();
      d.setDate(d.getDate() - parseInt(days));
      // let gatey = d.toLocaleString();
      let gatey = d.toISOString();
      console.log('gatey', gatey);
      where['orderDate'] = { $gt: gatey };
    }
    if (serviceType) where['service.name'] = serviceType;
    if (deliveryType) where['deliveryPlan.expressService'] = deliveryType;
    if (servicePlan) where['plan.plan'] = servicePlan;
    const response = [];
    const order = await this.orderRepository.find({
      where,
    });
    return order;
  }

  async ordersDetailsByFilter(searchOrderDto: SearchOrderDto, user: User) {
    try {
      const uId = await this.orderRepository.find({
        where: { userId: user.id.toString() },
      });

      if (!uId) {
        throw new NotFoundException();
      }
      return uId;
    } catch (err) {
      console.log('Error in orderDetails', err);
      throw new NotFoundException('Order not found');
    }
  }

  async getMyDeliveredOrder(user: User) {
    try {
      const order = await this.orderRepository.find({
        where: {
          userId: user.id.toString(),
          'status.mainStatus': 'Order Delivered',
        },
      });
      return order;
    } catch (err) {
      console.log('Error in getMyDeliveredOrder', err);
      throw new NotFoundException('Order not found');
    }
  }

  async rateOrder(feedback: RateOrder, currentUser: User) {
    if (!(currentUser.role.activeRole === 'CU'))
      throw new ForbiddenException('Only client user can rate the orders.');

    const { orderId } = feedback;
    const orderObjectId = getObjectId(orderId);

    const order = await this.orderRepository.findOne(orderObjectId);

    if (!order)
      throw new BadRequestException(`Order with order id ${orderId} not found`);

    order.feedback = {
      rating: feedback.rating,
      feedbackMessage: feedback.feedbackMessage,
    };

    return this.orderRepository.save(order);
  }

  async editOrder(editOrderDto: EditOrderDto, id: string, user: User) {
    // let { password } = editUserDto;
    try {
      let order = this.orderRepository.findOne({ id });
      // const {userId}=order;
      // if(user.id.toString() !== order.userId) throw new ForbiddenException('You are not authorized to edit this order');

      order = {
        ...order,
        ...editOrderDto,
      };

      this.orderRepository.editOrder(editOrderDto, id);
    } catch (err) {
      console.log(err);
      throw new NotFoundException('Order Catch what Not Found');
    }
  }

  async cancelOrder(oId: string, user: User) {
    try {
      const objectId = getObjectId(oId);
      const order = await this.orderRepository.findOne(objectId);

      if (user.id.toString() !== order.userId)
        throw new ForbiddenException(
          'You are not authorized to cancel this order',
        );
      if (!order) throw new NotFoundException('Order with given Id Not Found');

      order.status.push({
        mainStatus: 'Order Cancelled',
        subStatus: 'Order Cancelled',
        date: new Date().toISOString(),
        description: `${order.journalTitle} Order has been Cancelled`,
      });
      this.orderRepository.save(order);
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async orderSummeryDataFOrGraph() {
    const pipeline = [
      {
        $group: {
          _id: '$service.name',
          count: {
            $sum: 1,
          },
        },
      },
    ];
    const totalOrder = await (
      await this.orderRepository.aggregate([]).toArray()
    ).length;
    const order = await this.orderRepository.aggregate(pipeline).toArray();
    const response = {
      label: [],
      data: [],
      total: totalOrder,
    };
    for (let data of order) {
      response.label.push(data._id);
      response.data.push(data.count);
    }
    return response;
  }

  async orderDateWiseFilter(dateFilter) {
    const order = await this.orderRepository.find({
      where: {
        orderDate: dateFilter,
      },
    });
    return order
  }

  async getOrderDataForGraph() {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;
    const yearFilter = {
      $gte: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      $lte: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    };
    const monthFilter = {
      $gte: new Date(curr.getFullYear(), curr.getMonth(), 1).toISOString(),
      $lte: new Date(curr.getFullYear(), curr.getMonth() + 1, 0).toISOString(),
    };
    const weekFilter = {
      $gte: new Date(curr.setDate(first)).toISOString(),
      $lte: new Date(curr.setDate(last)).toISOString(),
    };
    const orderInYear=await this.orderDateWiseFilter(yearFilter)
    let month=[]
    for (let data of orderInYear) {
      month.push(
        new Date(data.orderDate).toLocaleString('default', { month: 'long' }),
      );
    }
    const yearlyOccurences = month.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const year = {
      label: Object.keys(yearlyOccurences),
      data: Object.values(yearlyOccurences),
    };

    let monthData=await this.orderDateWiseFilter(monthFilter)
    let currnetMonth = new Date().toLocaleString('default', { month: 'long' });
    const orderInMonth = [];
    for (let value of monthData) {
      if (
        new Date(value.orderDate).toLocaleString('default', {
          month: 'long',
        }) == currnetMonth
      ) {
        orderInMonth.push(
          new Date(value.orderDate).toISOString().slice(0, 9),
        );
      }
    }

    const monthlyOccurences = orderInMonth.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const months = {
      label: Object.keys(monthlyOccurences),
      data: Object.values(monthlyOccurences),
    };

    let weekData=await this.orderDateWiseFilter(weekFilter)
    let orderInThisWeek = [];
    for (let value of weekData) {
      orderInThisWeek.push(
        new Date(value.orderDate).toLocaleString('default', {
          weekday: 'long',
        }),
      );
    }

    const weeklyOccurences = orderInThisWeek.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const week = {
      label: Object.keys(weeklyOccurences),
      data: Object.values(weeklyOccurences),
    };
    return {
      year: year,
      month: months,
      week: week,
    };
  }
}
