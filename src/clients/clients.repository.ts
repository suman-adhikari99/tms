import { EntityRepository, Repository } from 'typeorm';
import { Clients } from './clients.entity';
import { BillingAddress, EditBillDto } from './dto/edit-bill.dto';
import { EditClientDto } from './dto/edit-client.dto';

@EntityRepository(Clients)
export class ClientsRepository extends Repository<Clients> {
  async editClient(editClient: EditClientDto, id: string) {
    const client = await this.findOne(id);
    Object.assign(client, editClient);
    return this.save(client);
  }

  async editClientBill(editClientBill: EditBillDto, id: string) {
    const client = await this.findOne(id);
    Object.assign(client, editClientBill);
    return this.save(client);
  }

  async addClientBill(cb: BillingAddress, id: string) {
    const client = await this.findOne(id);
    Object.assign(client, cb);
    return this.save(client);
  }
}
