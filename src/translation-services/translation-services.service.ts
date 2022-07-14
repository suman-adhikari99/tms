import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TranslationServicesRepository } from './translation-services.repository';

@Injectable()
export class TranslationServicesService {
  constructor(
    @InjectRepository(TranslationServicesRepository)
    private translationServicesRepository: TranslationServicesRepository,
  ) {}

  async getAllTranslationServices() {
    return await this.translationServicesRepository.find();
  }
}
