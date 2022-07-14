import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { ContractorRepository } from './contractor.repository';
import { getObjectId } from 'src/utilities';

@Injectable()
export class ContractorService {
  constructor(
    @InjectRepository(ContractorRepository)
    private contractorRepository: ContractorRepository,
  ) {}

  async create(createContractorDto: CreateContractorDto) {
    try {
      const { paymentSpec } = createContractorDto;
      const contractor = await this.contractorRepository.create({
        ...createContractorDto,
        paymentSpec: paymentSpec,
      });
      return this.contractorRepository.save(contractor);
    } catch {
      throw new NotFoundException(' some error occured');
    }
  }

  async findAll() {
    try {
      const contractor = await this.contractorRepository.find();
      return contractor;
    } catch (err) {
      throw new NotFoundException('Contractor not found');
    }
  }

  async findOne(id: string) {
    try {
      let realId = getObjectId(id);

      let contractor = await this.contractorRepository.findOne(realId);
      return contractor;
    } catch (err) {
      throw new NotFoundException('Contractor not found');
    }
  }

  async update(id: string, updateContractorDto: UpdateContractorDto) {
    try {
      let realId = getObjectId(id);
      let { paymentSpec } = updateContractorDto;

      let contractor = await this.contractorRepository.findOne(realId);
      contractor = {
        ...contractor,
        ...updateContractorDto,
      };
      return this.contractorRepository.save(contractor);
    } catch (err) {
      throw new NotFoundException('Contractor not found');
    }
  }

  async remove(id: string) {
    try {
      let realId = getObjectId(id);

      let contractor = await this.contractorRepository.findOne(realId);

      this.contractorRepository.delete(contractor);
    } catch (err) {
      throw new NotFoundException('Benefit not found');
    }
  }
}
