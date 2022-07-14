import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { ClientsService } from './clients.service';
import { AddBillDto } from './dto/add-bill.dto';
import { AddClientDto } from './dto/add-client.dto';
import { BillingAddress, EditBillDto } from './dto/edit-bill.dto';
import { EditClientDto } from './dto/edit-client.dto';

@Controller('clients')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  addClient(@Body() client: AddClientDto, @CurrentUser() user: User) {
    return this.clientsService.addClient(client, user);
  }

  @Post('create-bill/:id')
  addClientBill(@Body() billDto: BillingAddress, @Param('id') id: string) {
    return this.clientsService.addClientBill(billDto, id);
  }

  @Put('/editClient/:id')
  editClient(@Body() clientDto: EditClientDto, @Param('id') id: string) {
    return this.clientsService.editClient(clientDto, id);
  }

  @Put('/editClientBill/:id')
  editClientBill(@Body() editClientBill: EditBillDto, @Param('id') id: string) {
    return this.clientsService.editClientBill(editClientBill, id);
  }

  @Get()
  getClients() {
    return this.clientsService.allCLients();
  }

  @Get('bill')
  getBills() {
    return this.clientsService.allBills();
  }
}
