import { Controller, Get } from '@nestjs/common';
import { TranslationServicesService } from './translation-services.service';

@Controller('translation-services')
export class TranslationServicesController {
  constructor(private translationServicesService: TranslationServicesService) {}

  @Get()
  getAllEditableSections() {
    return this.translationServicesService.getAllTranslationServices();
  }
}
