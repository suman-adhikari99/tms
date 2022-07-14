import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getObjectId } from 'src/utilities';
import { BenefitRepository } from './benefits.repository';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectRepository(BenefitRepository)
    private benefitRepository: BenefitRepository,
  ) {}

  async create(createBenefitDto: CreateBenefitDto) {
    try {
      let benefit = await this.benefitRepository.create({
        ...createBenefitDto,
        status: 'active',
      });
      return this.benefitRepository.save(benefit);
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }

  async findAll() {
    try {
      const benefits = await this.benefitRepository.find();
      return benefits;
    } catch (err) {
      throw new NotFoundException('Book not found');
    }
  }

  async findOne(id: string) {
    try {
      let realId = getObjectId(id);

      let benefit = await this.benefitRepository.findOne(realId);
      return benefit;
    } catch (err) {
      throw new NotFoundException('Book not found');
    }
  }

  async update(id: string, updateBenefitDto: UpdateBenefitDto) {
    try {
      let realId = getObjectId(id);

      let benefit = await this.benefitRepository.findOne(realId);
      benefit = {
        ...benefit,
        ...updateBenefitDto,
      };
      return this.benefitRepository.save(benefit);
    } catch (err) {
      throw new NotFoundException('Benefit not found');
    }
  }

  async remove(id: string) {
    try {
      let realId = getObjectId(id);

      let benefit = await this.benefitRepository.findOne(realId);

      this.benefitRepository.delete(benefit);
    } catch (err) {
      throw new NotFoundException('Benefit not found');
    }
  }
}
