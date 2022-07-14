import { Controller, Get, Param } from '@nestjs/common';
import { OptionalServicesService } from './optional-services.service';

@Controller('optional-services')
export class OptionalServicesController {
    constructor(private optionalService: OptionalServicesService) { }

    @Get()
    getAllOptionalServices() {
        return this.optionalService.getAllOptionalServices();
    }

    @Get('/:serviceId')
    getOptionalServiceByServiceId(@Param('serviceId') serviceId: string) {
        return this.optionalService.getOptionalServicesByServiceId(serviceId);
    }
}