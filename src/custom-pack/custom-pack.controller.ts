import { Controller, Get } from '@nestjs/common';
import { CustomPackService } from './custom-pack.service';

@Controller('custom-pack')
export class CustomPackController {
  constructor(private customPackService: CustomPackService) {}

  @Get()
  getAllPublicationServices() {
    return this.customPackService.getAllCustomPackServices();
  }
}
