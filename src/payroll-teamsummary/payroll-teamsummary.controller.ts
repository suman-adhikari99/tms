import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { PayrollTeamsummaryService } from './payroll-teamsummary.service';

@Controller('payroll-teamsummary')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PayrollTeamsummaryController {
  constructor(
    private readonly payrollTeamsummaryService: PayrollTeamsummaryService,
  ) {}

  @Get('/id/:id')
  getPayrollTeamSummaryById(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.payrollTeamsummaryService.payrollTeamSummaryById(id, currentUser);
  }
  
  @Put('/approve-employee-payment-status/')
  approveEmployeePaymentStatus(
    @Query('employeeId') employeeId: string,
    @Query('payrollId') payrollId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.payrollTeamsummaryService.approveEmployeePaymentStatus(employeeId, payrollId, currentUser);
  }
}
