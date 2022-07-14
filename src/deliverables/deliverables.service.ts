import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { DeliverablesRepository } from './deliverables.repository';
import { PlaceDeliverablesDto } from './dto/place-deliverables.dto';

@Injectable()
export class DeliverablesService {
  constructor(
    @InjectRepository(DeliverablesRepository)
    private deliverablesRepository: DeliverablesRepository,
  ) {}

  async placeDeliverables(deliverables: PlaceDeliverablesDto, user: User) {
    const newDeliverables = this.deliverablesRepository.create({
      ...deliverables,
      date: new Date().toISOString(),
      documents: {
        manuscripts: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        invoices: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
    await this.deliverablesRepository.save(newDeliverables);
  }

  async getAllDeliverables() {
    return this.deliverablesRepository.find();
  }
}
