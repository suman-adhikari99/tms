import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServicesRepository } from './services.repository';
import { getObjectId } from 'src/utilities';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServicesRepository)
    private servicesRepository: ServicesRepository,
  ) { }



  async getAllServices() {
    return this.servicesRepository.find();
  }
}