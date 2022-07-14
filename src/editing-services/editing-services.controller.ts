import { Controller, Get } from '@nestjs/common';
import { EditingServicesService } from './editing-services.service';

@Controller('editing-services')
export class EditingServicesController {
  constructor(private editingServicesService: EditingServicesService) {}

  @Get()
  getAllEditableSections() {
    return this.editingServicesService.getAllEditingServices();
  }
}
