import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs';
import { ClientsRepository } from 'src/clients/clients.repository';
import { NewFolderService } from 'src/new-folder/new-folder.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { OrderRepository } from 'src/orders/order.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';
import { EditReviewOrderDto } from './dto/edit-review-order.dto';
import { FileDto } from './dto/file-dto';
import { ReviewOrderDto } from './dto/review-orders-dto';
import { ReviewOrder } from './review-orders.entity';
import { ReviewOrderRepository } from './review-orders.repository';

@Injectable()
export class ReviewOrdersService {
  constructor(
    @InjectRepository(ReviewOrder)
    private reviewOrderRepository: ReviewOrderRepository,
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
    private clientRepositiory: ClientsRepository,
    private notificationService: NotificationsService,
    private newFolderService: NewFolderService,
  ) {}

  async getAllReviewOrders() {
    return await this.reviewOrderRepository.find();
  }

  // create new review order with same order id
  async createNewReviewOrder(reviewOrder: EditReviewOrderDto, reviewBy: User) {
    const { orderId } = reviewOrder;
    const objectId = getObjectId(orderId);
    const order = await this.orderRepository.findOne(objectId);
    console.log('OOO', order);

    // Conversion of Date
    const futureDate = new Date(order.orderDate);
    let totalDate = futureDate.setDate(
      futureDate.getDate() + order.deliveryPlan.planSchedule,
    );
    let newDate = new Date(totalDate);
    let totalFutureDate = newDate.setDate(newDate.getDate() + 30);
    const finalDate = new Date(totalFutureDate);
    // DATE complete

    const user = await this.userRepository.findOne(order.userId);
    const ro = await this.reviewOrderRepository.findOne({
      where: { orderId: orderId },
    });
    let stat = {
      status: 'Pending',
      date: new Date().toISOString(),
      description: '',
    };
    if (ro) {
      const newReview = await this.reviewOrderRepository.create({
        ...reviewOrder,
        date: new Date().toISOString(),
        billingAddressReview: order.billingAddress,
        orderId,
        userId: order.userId,
        reviewedBy: reviewBy.id.toString(),
        quotationStatus: 'Revised',
        quotationNumber: Math.floor(Math.random() * 1000000).toString(),
        orderDate: order.orderDate,
        wordCount: order.wordCount,
        omitSections: order.omissionSections,
        omissionOther: order.omissionOther,
        manuscriptPurpose: order.manuscriptPurpose,
        manuscriptType: order.manuscriptType,
        optionalServices: order.optionalServices,
        manuscriptFile: order.manuscriptFile,
        journalTitle: order.journalTitle,
        academicField: order.academicField,
        specialRequest: order.specialRequest,
        totalServiceCost: order.totalServiceCost,
        personalInformation: order.personalInformation,
        service: order.service,
        plan: order.plan,
        deliveryPlan: order.deliveryPlan,
        editEntireDocument: order.editEntireDocument,
        wordReduction20Percent: order.wordReduction20Percent,
        language: order.language,
        status: order.status,
      });

      const objId = getObjectId(order.id);
      const oldOrder = await this.orderRepository.findOne(objId);

      await this.reviewOrderRepository.save(newReview);
      newReview.status.push({
        mainStatus: 'Order in review',
        subStatus: 'Order in review',
        date: new Date().toISOString(),
        description: 'Order is being reviewed',
      });
      const newR = await this.reviewOrderRepository.save(newReview);

      oldOrder.reviewOrderId = newR.id.toString();
      oldOrder.reviewedBy = newReview.reviewedBy;
      this.orderRepository.save(oldOrder);
      this.notificationService.orderInReview(oldOrder);
      // this.notificationService.sendNewQuotationNotification(newReview);
    } else {
      // const order = await this.orderRepository.findOne(orderId);
      // const user = await this.userRepository.findOne(order.userId);

      const newReviewOrder = await this.reviewOrderRepository.create({
        ...reviewOrder,
        orderId,
        userId: order.userId,
        date: new Date().toISOString(),
        billingAddressReview: order.billingAddress,
        reviewedBy: reviewBy.id.toString(),
        quotationStatus: 'Not Approved',
        quotationNumber: Math.floor(Math.random() * 1000000).toString(),
        orderDate: order.orderDate,
        wordCount: order.wordCount,
        omitSections: order.omissionSections,
        omissionOther: order.omissionOther,
        manuscriptPurpose: order.manuscriptPurpose,
        manuscriptType: order.manuscriptType,
        optionalServices: order.optionalServices,
        manuscriptFile: order.manuscriptFile,
        journalTitle: order.journalTitle,
        academicField: order.academicField,
        specialRequest: order.specialRequest,
        totalServiceCost: order.totalServiceCost,
        personalInformation: order.personalInformation,
        service: order.service,
        plan: order.plan,
        deliveryPlan: order.deliveryPlan,
        editEntireDocument: order.editEntireDocument,
        wordReduction20Percent: order.wordReduction20Percent,
        language: order.language,
        status: order.status,
      });
      // this.reviewOrderRepository.save(newReviewOrder);
      newReviewOrder.status.push({
        mainStatus: 'Order Reviewed',
        subStatus: 'Order Reviewed',
        date: new Date().toISOString(),
        description: 'Order is being reviewed',
      });
      this.reviewOrderRepository.save(newReviewOrder);

      const objId = getObjectId(order.id);
      const oldOrder = await this.orderRepository.findOne(objId);
      oldOrder.reviewOrderId = newReviewOrder.id;
      oldOrder.reviewedBy = newReviewOrder.reviewedBy;
      oldOrder.status.push({
        mainStatus: 'Order Reviewed',
        subStatus: 'Order Reviewed',
        date: new Date().toISOString(),
        description: 'Order has reviewed',
      });
      this.orderRepository.save(oldOrder), reviewBy;
      this.notificationService.orderInReview(oldOrder);
      // this.notificationService.sendNewQuotationNotification(newReviewOrder);
    }
  }

  // change status of invoice to paid
  async markAsPaid(id: string) {
    const objectId = getObjectId(id);
    const reviewOrder = await this.reviewOrderRepository.findOne(objectId);

    const orderObjectId = getObjectId(reviewOrder.orderId);
    const order = await this.orderRepository.findOne(orderObjectId);
    if (!reviewOrder) {
      throw new BadRequestException('Review Order not found');
    }
    reviewOrder.date = new Date().toISOString();
    reviewOrder.invoice.status = 'Paid';
    reviewOrder.status.push({
      mainStatus: 'Payment Received',
      subStatus: 'Payment Received',
      date: new Date().toISOString(),
      description: 'Payment has been received',
    });
    this.reviewOrderRepository.save(reviewOrder);

    order.status.push({
      mainStatus: 'Payment Received',
      subStatus: 'Payment Received',
      date: new Date().toISOString(),
      description: 'Payment has made',
    });
    order.invoice.status = 'Paid';
    this.orderRepository.save(order);
    this.notificationService.markAsPaidNoticeForAdmin(reviewOrder);
  }

  // get review-orders whose quotationStation is not not approved
  async getNotApprovedReviewOrders() {
    const orders = await this.reviewOrderRepository.find({
      where: {
        quotationStatus: { $ne: 'Not Approved' },
      },
    });
    const desc = orders.sort((a, b) => (a.date > b.date ? -1 : 1));
    return desc;
    // where:{ quotationStatus: {$not: {'Not Approved' }}}});
  }

  // generate invoice array inside review order
  async generateInvoice(id: string, fileDto: FileDto) {
    const { file } = fileDto;
    const objectId = getObjectId(id);
    const rvwOrder = await this.reviewOrderRepository.findOne(objectId);

    const { orderId } = rvwOrder;
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Conversion of Date
    const futureDate = new Date(order.orderDate); // need to be optimize ===> add date, using javascript add date
    let totalDate = futureDate.setDate(
      futureDate.getDate() + order.deliveryPlan.planSchedule,
    );
    let newDate = new Date(totalDate);
    let totalFutureDate = newDate.setDate(newDate.getDate() + 30);
    const finalDate = new Date(totalFutureDate);
    // DATE complete

    rvwOrder.quotationStatus = 'Invoiced';
    rvwOrder.date = new Date().toISOString();

    rvwOrder.invoice = {
      invoiceId: Math.floor(Math.random() * 1000000),
      createdDate: new Date().toISOString(),
      dueDate: finalDate.toISOString(),
      status: 'Pending',
      file: {
        uploadedBy: file.uploadedBy,
        fileName: file.fileName,
        filePath: file.filePath,
        fileType: file.fileType,
        fileSize: file.fileSize,
        fileId: file.fileId,
        uploadedAt: file.uploadedAt,
        uploadedTime: file.uploadedTime,
      },
    };
    rvwOrder.date = new Date().toISOString();
    this.reviewOrderRepository.save(rvwOrder);
    order.invoice = {
      invoiceId: Math.floor(Math.random() * 1000000),
      createdDate: new Date().toISOString(),
      dueDate: finalDate.toISOString(),
      status: 'Pending',
      file: {
        uploadedBy: file.uploadedBy,
        fileName: file.fileName,
        filePath: file.filePath,
        fileType: file.fileType,
        fileSize: file.fileSize,
        fileId: file.fileId,
        uploadedAt: file.uploadedAt,
        uploadedTime: file.uploadedTime,
      },
    };

    this.orderRepository.save(order);
    this.notificationService.invoiceGeneratedNoticeForAdmin(rvwOrder);
    this.newFolderService.addFolderInOrderToAddInvoice(rvwOrder);
  }

  // date comparison
  dateComparison(date1: Date, date2: Date): boolean {
    const date1_ms = date1.getTime();
    const date2_ms = date2.getTime();
    const difference_ms = date1_ms - date2_ms;
    return difference_ms > 0;
  }

  async getLatestReviewOrders() {
    const invoices = await this.reviewOrderRepository.find({
      where: {
        invoice: { $exists: true },
      },
      order: { date: 'DESC' },
    });
    const mapped = {};
    invoices.map((invoice) => {
      if (!mapped.hasOwnProperty(invoice.orderId)) {
        mapped[invoice.orderId] = invoice;
      } else {
        if (
          this.dateComparison(
            new Date(invoice.date),
            new Date(mapped[invoice.orderId].date),
          )
        ) {
          mapped[invoice.orderId] = invoice;
        }
      }
    });

    return Object.values(mapped);
    // return mapped;
  }

  // get latest quotations
  async getLatestQuotations() {
    const quotations = await this.reviewOrderRepository.find({
      where: {
        // quotationStatus: { $ne: 'Not Approved' },
        quotationStatus: { $ne: 'Not Approved' },
      },
      order: { date: 'DESC' },
    });
    const mapped = {};
    quotations.map((quotation) => {
      if (!mapped.hasOwnProperty(quotation.orderId)) {
        mapped[quotation.orderId] = quotation;
      } else {
        if (
          this.dateComparison(
            new Date(quotation.date),
            new Date(mapped[quotation.orderId].date),
          )
        ) {
          mapped[quotation.orderId] = quotation;
        }
      }
    });
    // return mapped;
    return Object.values(mapped);
  }

  // get all quotations that have same orderId
  async getQuotationsByOrderId(orderId: string) {
    const quotations = await this.reviewOrderRepository.find({
      where: {
        quotationStatus: { $exists: true },
        orderId,
      },
      order: { date: 'DESC' },
    });
    return quotations;
  }

  async acceptOrder(id: string, user: User) {
    try {
      let stat = [
        {
          date: new Date().toISOString(),
          mainStatus: 'Order confirmed',
          subStatus: 'Order confirmed',
          description: 'Order Confirmed. Now order in progress.',
        },
        {
          date: new Date().toISOString(),
          mainStatus: 'Client manager joined',
          subStatus: 'Client manager joined',
          description: 'New Team Member joined the team.',
        },
        {
          date: new Date().toISOString(),
          mainStatus: 'Creating Project',
          subStatus: 'Creating Project',
          description: 'Project is being Created.',
        },
      ];
      const { role } = user;
      if (role.activeRole != 'CM') {
        throw new BadRequestException('You are not a client manager');
      }
      let oId = await this.orderRepository.findOne(id); // order
      if (!oId) {
        throw new NotFoundException('Order  not found');
      }
      oId.status.push(...stat);
      this.orderRepository.save(oId);

      const reviewOrder = await this.reviewOrderRepository.find({
        where: {
          orderId: id,
          quotationStatus: 'Not Approved',
        },
      });
      if (!reviewOrder) {
        throw new NotFoundException('Order Status type not found');
      } else {
        reviewOrder[0].quotationStatus = 'New';
        reviewOrder[0].date = new Date().toISOString();
        reviewOrder[0].status.push(...stat);

        this.reviewOrderRepository.save(reviewOrder);
        this.notificationService.sendNewQuotationNotification(reviewOrder); // send notifications to CU,BM
      }
    } catch (err) {
      console.log(err);
      throw new NotFoundException(err);
    }
  }

  // get all invoices of a client
  async getInvoicesByClientId(clientId: string) {
    const invoices = await this.reviewOrderRepository.find({
      where: {
        userId: clientId,
        quotationStatus: 'Invoiced',
        // invoice: { $exists: true },
      },
    });
    return invoices;
  }

  getReviewOrderById(id: string) {
    const objectId = getObjectId(id);
    return this.reviewOrderRepository.findOne(objectId);
  }

  // list all client users
  async getAllClientUsers() {
    const users = await this.userRepository.find({
      where: {
        role: 'CU',
      },
    });
    return users;
  }

  // get review order by userId
  async getOrderByUserId(userId: string) {
    const orders = await this.reviewOrderRepository.find({
      where: {
        userId,
      },
    });
    return orders;
  }

  // find one user that has invoices
  async getUserByInvoice(userId: string) {
    const reviewOrder = await this.reviewOrderRepository.find({
      where: {
        invoice: { $exists: true },
        userId: userId,
      },
    });
    return reviewOrder;
  }

  // get profile by userId
  async getProfileByUserId(userId: string) {
    let clientName: {};
    let clientEmail = '';
    let clientNumber = '';
    let billingType = '';
    let price = '';
    let address = '';
    let status = [];
    let position = '';
    let institute_name = '';
    let department_name = '';
    let specialization = [];
    let tags = [];
    let billing_info = [];

    const objectId = getObjectId(userId);
    const profile = await this.userRepository.findOne(objectId);
    const { email, telephoneNumber } = profile;
    // search inside array and of first object
    const bill = await this.clientRepositiory.find({
      where: {
        'personalInformation.email': email,
      },
    });

    clientName = {
      name: profile.fullName,
      url: profile.image,
    };
    clientEmail = email;
    clientNumber = telephoneNumber;
    for (let i = 0; i < bill.length; i++) {
      billingType = bill[i].billingAddress[0].billingType;
    }
    price = '￥25,000';
    // date
    status = [
      {
        date: '2022-04-01T09:21:27.541Z',
        status: 'Payment Pending',
        description: 'New order arrived. Send for confirmation',
      },
    ];
    address = 'Tokyo, Japan';
    position = profile.positionTitle;
    institute_name = profile.institutionName;
    department_name = profile.departmentName;
    specialization = profile.specialization;
    tags = ['Neurosurgery', 'Biochemistry', 'Neurology'];
    for (let i = 0; i < bill.length; i++) {
      billing_info.push(bill[i].billingAddress[0]);
    }

    // return all
    return {
      clientName,
      clientEmail,
      clientNumber,
      billingType,
      address,
      price,
      status,
      position,
      institute_name,
      department_name,
      specialization,
      tags,
      billing_info,
    };
  }

  async getMyInvoices(userId: User) {
    let invoices = [];
    const reviewOrder = await this.reviewOrderRepository.find({
      where: {
        userId: userId.id.toString(),
        // invoice: { $exists: true },
        quotationStatus: 'Invoiced',
      },
      order: { date: 'DESC' },
    });
    // for (let i = 0; i < reviewOrder.length; i++) {
    //   invoices.push(reviewOrder[i].invoice);
    // }
    return reviewOrder;
  }

  async InvoiceRaiseFilter(dateFilter) {
    const invoices = await this.reviewOrderRepository.find({
      where: {
        invoice: { $exists: true },
        'invoice.createdDate': dateFilter,
      },
    });
    return invoices.length;
  }

  async getInvoiceRaiseDataForGraph() {
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
    return {
      year: await this.InvoiceRaiseFilter(yearFilter),
      month: await this.InvoiceRaiseFilter(monthFilter),
      week: await this.InvoiceRaiseFilter(weekFilter),
    };
  }
}
