import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PresentationServiceRepository } from './presentation-services.repository';

@Injectable()
export class PresentationServicesService {
  constructor(
    @InjectRepository(PresentationServiceRepository)
    private presentationServiceRepository: PresentationServiceRepository,
  ) {}

  async getAllPresentationServices() {
    return await this.presentationServiceRepository.find();
  }
}
