import { Controller, Get } from '@nestjs/common';
import { PublicationServicesService } from './publication-services.service';

@Controller('publication-services')
export class PublicationServicesController {
  constructor(private publicationServicesService: PublicationServicesService) {}

  @Get()
  getAllPublicationServices() {
    return this.publicationServicesService.getAllPublicationServices();
  }
}
