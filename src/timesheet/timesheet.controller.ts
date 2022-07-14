import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { TimesheetService } from './timesheet.service';

@Controller('timesheet')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TimesheetController {
  constructor(private readonly timesheetService: TimesheetService) {}

  @Get('/between')
  getTimesheetReportsBetween(
    @Query('startdate') startDate: string,
    @Query('enddate') endDate: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.timesheetService.getTimesheetReportsBetween(
      startDate,
      endDate,
      currentUser,
    );
  }

  @Get('/all')
  getTimesheetReports(@CurrentUser() currentUser: User) {
    return this.timesheetService.getTimesheetReports(currentUser);
  }
}
