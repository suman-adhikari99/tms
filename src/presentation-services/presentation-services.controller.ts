import { Controller, Get } from '@nestjs/common';
import { PresentationServicesService } from './presentation-services.service';

@Controller('presentation-services')
export class PresentationServicesController {
  constructor(
    private presentationServicesService: PresentationServicesService,
  ) {}

  @Get()
  getAllEditableSections() {
    return this.presentationServicesService.getAllPresentationServices();
  }
}
