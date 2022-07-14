import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getObjectId } from 'src/utilities';

import { CreateInhouseDto } from './dto/create-inhouse.dto';
import { UpdateInhouseDto } from './dto/update-inhouse.dto';
import { InHouseRepository } from './inhouse.repository';

@Injectable()
export class InhouseService {
  constructor(
    @InjectRepository(InHouseRepository)
    private inHouseRepository: InHouseRepository,
  ) {}

  async create(createInhouseDto: CreateInhouseDto) {
    try {
      let inHouse = this.inHouseRepository.create(createInhouseDto);
      return this.inHouseRepository.save(inHouse);
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }

  async findAll() {
    try {
      const inHouses = await this.inHouseRepository.find();
      return inHouses;
    } catch (err) {
      throw new NotFoundException('inHouse not found');
    }
  }

  async findOne(id: string) {
    try {
      let realId = getObjectId(id);

      let inHouse = await this.inHouseRepository.findOne(realId);
      return inHouse;
    } catch (err) {
      throw new NotFoundException('inHouse not found');
    }
  }

  async update(id: string, updateInhouseDto: UpdateInhouseDto) {
    try {
      let realId = getObjectId(id);

      let inHouse = await this.inHouseRepository.findOne(realId);
      inHouse = {
        ...inHouse,
        ...updateInhouseDto,
      };
      return this.inHouseRepository.save(inHouse);
    } catch (err) {
      throw new NotFoundException('Deduction not found');
    }
  }

  async remove(id: string) {
    try {
      let realId = getObjectId(id);

      let inHouse = await this.inHouseRepository.findOne(realId);
      this.inHouseRepository.delete(inHouse);
    } catch (err) {
      throw new NotFoundException('Deduction not found');
    }
  }
}
