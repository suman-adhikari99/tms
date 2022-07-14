import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicationSerViceRepository } from './publication-services.repository';

@Injectable()
export class PublicationServicesService {
  constructor(
    @InjectRepository(PublicationSerViceRepository)
    private publicationServiceRepository: PublicationSerViceRepository,
  ) {}

  async getAllPublicationServices() {
    return await this.publicationServiceRepository.find();
  }

  async getAllCustomPackFeatures() {
    return await this.publicationServiceRepository.find();
  }
}
