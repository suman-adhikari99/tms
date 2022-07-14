import { User } from 'src/users/user.entity';
import { EntityRepository, MongoRepository } from 'typeorm';
import { EditOrderDto } from './dto/edit-order.dto';
import { Order } from './order.entity';

@EntityRepository(Order)
export class OrderRepository extends MongoRepository<Order> {
  async editOrder(editOrderDto: EditOrderDto, id: string) {
    const order = await this.findOne(id);
    Object.assign(order, editOrderDto);
    return this.save(order);
  }
}
