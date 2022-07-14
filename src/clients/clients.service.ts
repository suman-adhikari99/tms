import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';
import { ClientsRepository } from './clients.repository';
import { AddClientDto } from './dto/add-client.dto';
import { BillingAddress, EditBillDto } from './dto/edit-bill.dto';
import { EditClientDto } from './dto/edit-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsRepository)
    private clientsRepository: ClientsRepository,
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
  ) {}

  async addClient(clientDto: AddClientDto, user: User) {
    const { orderId } = clientDto;
    // find the order
    const objectId = getObjectId(orderId);
    const order = await this.orderRepository.findOne(objectId);
    // if (!order.userId) {
    //   throw new NotFoundException('UserId is not exists on order');
    // }
    const newClient = this.clientsRepository.create({
      ...clientDto,
      userId: order.userId,
    });
    return await this.clientsRepository.save(newClient);
  }

  async addClientBill(billDto: BillingAddress, id: string) {
    const objectId = getObjectId(id);
    const client = await this.clientsRepository.findOne(objectId);
    if (!client) {
      throw new NotFoundException('Client not found');
    } else {
      if (client.billingAddress) {
        client.billingAddress.push(billDto);
      } else {
        client.billingAddress = [];
        client.billingAddress.push(billDto);
        // return await this.clientsRepository.addClientBill(billDto, id);
      }
      return await this.clientsRepository.save(client);
    }
  }

  async allCLients() {
    return this.clientsRepository.find();
  }

  async allBills() {
    return this.clientsRepository.find({
      select: ['billingAddress'],
    });
  }

  async editClient(editClientDto: EditClientDto, id: string) {
    const client = this.clientsRepository.findOne({ id });

    if (!client) {
      throw new NotFoundException('Client not found');
    } else {
      this.clientsRepository.editClient(editClientDto, id);
    }
  }

  async editClientBill(editClientBillDto: EditBillDto, id: string) {
    const client = this.clientsRepository.findOne({ id });

    if (!client) {
      throw new NotFoundException('Bill not found');
    } else {
      this.clientsRepository.editClientBill(editClientBillDto, id);
    }
  }
}
