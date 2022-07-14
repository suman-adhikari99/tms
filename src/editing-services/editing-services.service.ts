import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EditingServicesRepository } from './editing-services.repository';

@Injectable()
export class EditingServicesService {
  constructor(
    @InjectRepository(EditingServicesRepository)
    private editingServicesRepository: EditingServicesRepository,
  ) {}

  async getAllEditingServices() {
    return await this.editingServicesRepository.find();
  }
}
