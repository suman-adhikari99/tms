import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getObjectId } from 'src/utilities';
import { DeductionRepository } from './deductions.repository';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';

@Injectable()
export class DeductionsService {
  constructor(
    @InjectRepository(DeductionRepository)
    private deductionRepository: DeductionRepository,
  ) {}

  async create(createDeductionDto: CreateDeductionDto) {
    try {
      let deduction = await this.deductionRepository.create({
        ...createDeductionDto,
        status: 'Active',
      });
      return this.deductionRepository.save(deduction);
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }

  async findAll() {
    try {
      const deductions = await this.deductionRepository.find();
      return deductions;
    } catch (err) {
      throw new NotFoundException('Deduction not found');
    }
  }

  async findOne(id: String) {
    try {
      let realId = getObjectId(id);

      let deduction = await this.deductionRepository.findOne(realId);
      return deduction;
    } catch (err) {
      throw new NotFoundException('Deduction not found');
    }
  }

  async update(id: string, updateDeductionDto: UpdateDeductionDto) {
    try {
      let realId = getObjectId(id);

      let deduction = await this.deductionRepository.findOne(realId);
      deduction = {
        ...deduction,
        ...updateDeductionDto,
      };
      return this.deductionRepository.save(deduction);
    } catch (err) {
      throw new NotFoundException('Deduction not found');
    }
  }

  async remove(id: string) {
    try {
      let realId = getObjectId(id);

      let deduction = await this.deductionRepository.findOne(realId);

      this.deductionRepository.delete(deduction);
    } catch (err) {
      throw new NotFoundException('Deduction not found');
    }
  }
}
