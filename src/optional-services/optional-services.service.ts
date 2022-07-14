import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionalServiceRepository } from './optional-service.repository';

@Injectable()
export class OptionalServicesService {
    constructor(@InjectRepository(OptionalServiceRepository) private optionalServiceRepository: OptionalServiceRepository) { }

    getAllOptionalServices() {
        return this.optionalServiceRepository.find();
    }

    async getOptionalServicesByServiceId(id: string) {
        try {
            const optionalService = await this.optionalServiceRepository.find({
                where: {
                    serviceId: id
                }
            })
            if (!optionalService) {
                throw new NotFoundException('Not Found Optional Service with given id')
            } else {
                return optionalService;
            }
        } catch {
            throw new NotFoundException('Optional Service Not Found');
        }
    }
}
