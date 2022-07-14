import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
} from '@nestjs/common';
import { PayRollService } from './payroll.service';
import { PayRollDto } from './dto/create_payroll_dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('payroll')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class PayrollController {
  constructor(private payRollService: PayRollService) {}

  @Post()
  createPayroll(@Body() payRollDto: PayRollDto) {
    return this.payRollService.createPayroll(payRollDto);
  }

  @Put('/approveTeamSummary/:projectId/:userId')
  approvedTeamSummary(
    @Param('projectId') projectId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ) {
    return this.payRollService.approveTeamSummary(projectId, userId, user);
  }

  @Put('/add/:projectId/:userId')
  add(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    return this.payRollService.add(projectId, userId);
  }

  @Put('/saveProject/:id')
  saveAndApprovedProject(@Param('id') id: string, @CurrentUser() user: User) {
    return this.payRollService.saveAndApprovedProject(id, user);
  }

  @Put('/savePayroll/:id')
  saveAndApprovedPayroll(@Param('id') id: string, @CurrentUser() user: User) {
    return this.payRollService.saveAndApprovedPayroll(id, user);
  }

  @Put('/runPayroll/:id')
  runPayroll(@Param('id') id: string, @CurrentUser() user: User) {
    return this.payRollService.runPayroll(id, user);
  }

  @Put('/completePayroll/:id')
  makeCompletePayroll(@Param('id') id: string, @CurrentUser() user: User) {
    return this.payRollService.makeCompletePayroll(id, user);
  }

  @Get('/closedProject')
  getApprovedTeamMember(@CurrentUser() user: User) {
    return this.payRollService.getApprovedTeamMember(user);
  }

  @Get('/completedPayroll')
  getCompletedPayroll(@CurrentUser() user: User) {
    return this.payRollService.getCompletedPayroll(user);
  }

  @Get('/notCompletedPayroll')
  getNotCompletedPayroll(@CurrentUser() user: User) {
    return this.payRollService.getNotCompletedPayroll(user);
  }

  @Get('/date/:startDate/:endDate')
  getApprovedTeamMemberBetweenDates(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @CurrentUser() user: User,
  ) {
    return this.payRollService.getApprovedTeamMemberBetweenDates(
      startDate,
      endDate,
      user,
    );
  }

  @Get('/closedProject')
  getClosedProject(@CurrentUser() user: User) {
    return this.payRollService.getClosedProject(user);
  }

  @Get('/closedTask')
  getClosedTask(@CurrentUser() user: User) {
    return this.payRollService.getClosedTask(user);
  }

  @Get('/closedTaskByProject/:projectId')
  getClosedTaskByProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return this.payRollService.getClosedTaskByProjectId(projectId, user);
  }

  @Get('/teamSummary')
  getTeamSummary(@CurrentUser() user: User) {
    return this.payRollService.teamSummary1();
  }

  @Get('/allEmployee')
  async getAllEmployee(@CurrentUser() user: User) {
    return this.payRollService.getAllEmployee(user);
  }

  @Get('/getTeamSummary/:projectId')
  async getTeamSummaryOfProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return this.payRollService.getTeamSummaryOfProject(user, projectId);
  }

  @Get('/id/:id')
  getById(@Param('id') id: string) {
    return this.payRollService.getById(id);
  }

  @Get()
  getAll() {
    return this.payRollService.getAll();
  }

  @Put('/adminApprove/:id/')
  adminApprove(
    @Param('id') payrollId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.payRollService.adminApprove(payrollId, currentUser);
  }

  @Put('/adminPaid/:id/')
  adminPaid(
    @Param('id') payrollId: string,
    @CurrentUser() currentUser: User
  ) {
    return this.payRollService.adminPaid(payrollId, currentUser);
  }

  @Get('/admin-paid-payroll/')
  getAdminPaidPayroll(
    @CurrentUser() currentUser: User
  ) {
    return this.payRollService.getAdminPaidPayroll(currentUser);
  }
  
  @Get('/admin-unpaid-payroll/')
  getAdminUnpaidPayroll(
    @CurrentUser() currentUser: User
  ) {
    return this.payRollService.getAdminUnpaidPayroll(currentUser);
  }
  
  @Put('/archive-payroll/:id')
  archivePayroll(
    @Param('id') payrollId: string,
    @CurrentUser() currentUser: User,
    ) {
    return this.payRollService.archivePayroll(payrollId, currentUser);
  }

  // @Put('/test/:id')
  // test(@Param('id') id: string) {
  //   return this.payRollService.teamSummary(id);
  // }
}
