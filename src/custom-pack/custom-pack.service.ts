import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomPackRepository } from './custom-pack.repository';

@Injectable()
export class CustomPackService {
  constructor(
    @InjectRepository(CustomPackRepository)
    private customPackRepo: CustomPackRepository,
  ) {}

  async getAllCustomPackServices() {
    return await this.customPackRepo.find();
  }
}
