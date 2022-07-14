import { Controller, Get } from '@nestjs/common';
import { ResponsibilityService } from './responsibilities.services';

@Controller('responsibilities')
export class ResponsibilityController {
  constructor(private responsibilityService: ResponsibilityService) {}

  @Get()
  getAllResponsibility() {
    return this.responsibilityService.getAllResponsibility();
  }
}
