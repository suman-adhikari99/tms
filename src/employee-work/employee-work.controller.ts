import { Controller, Get, Param, Post } from '@nestjs/common';
import { EmployeeWorkService } from './employee-work.service';

@Controller('employee-work')
export class EmployeeWorkController {
  constructor(private employeeWorkService: EmployeeWorkService) {}

  @Get('/project/:userId')
  employeeProject(@Param('userId') userId: string) {
    return this.employeeWorkService.getProjects(userId);
  }

  @Get('/task/:userId')
  employeeT(@Param('userId') userId: string) {
    return this.employeeWorkService.getTasks(userId);
  }

  // @Get('/pts')
  // getPayrollTeamSummary() {
  //   return this.employeeWorkService.payrollTeamSummary();
  // }
}
