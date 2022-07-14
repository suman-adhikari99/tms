import { Controller, Get, Param } from '@nestjs/common';
import { PlanOptionsService } from './plan-options.service';
import { PlansService } from './plans.service';
import { ServicesService } from './services.service';
import { instanceToPlain } from 'class-transformer';
// import { classToPlain } from 'class-transformer';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly plansService: PlansService,
    private readonly planOptionsService: PlanOptionsService,
  ) {}

  // @Get('/:serviceId/discountToken')
  // getDiscountToken(@Param('serviceId') serviceId: string) {
  //   return this.servicesService.getDiscountToken(serviceId);
  // }

  @Get()
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get('/plans')
  getAllPlans() {
    return this.plansService.getAll();
  }

  @Get('/:serviceId/plans')
  getPlansByServiceId(@Param('serviceId') serviceId: string) {
    return this.plansService.getPlansByServiceId(serviceId);
  }

  @Get('/planOptions/:planId')
  getPlanOptionsByPlanId(@Param('planId') planId: string) {
    return this.planOptionsService.getByPlanId(planId);
  }

  @Get('/planOptions')
  getAllPlanOptions() {
    return this.planOptionsService.getAll();
  }

  @Get('/planOptionsByServiceId/:serviceId')
  async getPlanOptionsByServiceId(@Param('serviceId') serviceId: string) {
    const plans = await this.getPlansByServiceId(serviceId);
    const planIds = instanceToPlain(plans).map((plan) => plan.id);
    const planOptions = await this.planOptionsService.getByPlanIds(planIds);
    return planOptions;
  }
}

// const planIds = classToPlain(plans).map((plan) => plan.id);
// const planOptions = await this.planOptionsService.getByPlanIds(planIds);
// return planOptions;
