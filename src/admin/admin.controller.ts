import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { AdminService } from './admin.service';
import { EmployeeService } from 'src/employee/employee.service';
import { TaskService } from 'src/task/task.service';
import { ProjectManagementService } from 'src/projects/project-management.service';
import { DashboardService } from 'src/dashboard/dashboard.service';
import { ReviewOrdersService } from 'src/review-orders/review-orders.service';
import { OrdersService } from 'src/orders/orders.service';
import { PayRollService } from 'src/payroll/payroll.service';

@Controller('admin')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private projectManagementService: ProjectManagementService,
    private dashBoardService: DashboardService,
    private reviewOrderService: ReviewOrdersService,
    private orderService: OrdersService,
    private payrollService:PayRollService
  ) {}

  @Get('/orders')
  async getAllOrders(@CurrentUser() user: User) {
    return this.adminService.getAllOrders(user);
  }

  @Get('/projects')
  async getAllProjects(@CurrentUser() user: User) {
    return this.adminService.getAllProjects(user);
  }

  @Get('/assistanceRequests')
  async getAllAssistanceRequests(@CurrentUser() user: User) {
    return this.adminService.getAllAssistanceRequests(user);
  }

  @Get('/clientUsers')
  async getAllClientUsers(@CurrentUser() user) {
    return this.adminService.getAllClientUsers(user);
  }

  @Put('/markPayPayroll/:id')
  async markAsPaid(@Param('id') id: string, @CurrentUser() user: User) {
    return this.adminService.markAsPaid(id, user);
  }

  @Get('/paidPayroll')
  async getPaidPayroll(@CurrentUser() user: User) {
    return this.adminService.getAllPaidPayroll(user);
  }

  @Delete('/deleteClientUser/:id')
  async deleteClientUser(@Param('id') id: string) {
    return this.adminService.deleteClientUser(id);
  }

  @Get('/clientInvoice')
  async getAllReviewOrders(@CurrentUser() user: User) {
    return this.adminService.getAllClientInvoices(user);
  }

  @Get('/totalIncome')
  async totalIncome(@CurrentUser() user: User) {
    return this.adminService.totalIncome(user);
  }

  @Get('/totalExpense')
  async totalExpense(@CurrentUser() user: User) {
    return this.adminService.totalExpense(user);
  }

  @Get('/allEmployee')
  async getAllEmployee(@CurrentUser() user: User) {
    return this.adminService.getAllEmployee(user);
  }

  @Get('/overDue')
  async overDue() {
    return this.adminService.deliveryDateNotification();
  }

  @Get('/terminatedEmployees')
  async getTerminatedEmployee(@CurrentUser() user: User) {
    return this.adminService.getAllTerminatedEmployee(user);
  }

  @Get('/allDepartment')
  async getAllDepartment(@CurrentUser() user: User) {
    return this.adminService.getAllDepartment(user);
  }

  @Get('/benefitDetails')
  async getBenificialDetails(@CurrentUser() user: User) {
    return this.adminService.getBenifitDetails(user);
  }

  @Get('/benefitDataForGraph')
  async getDateWiseDataOFBenefitsForGraph(@CurrentUser() user: User) {
    return this.adminService.getDateWiseDataOFBenefitsForGraph(user);
  }

  @Get('/employeeDataForGraph')
  async getemployeeDataForGraph(@CurrentUser() user: User) {
    return this.employeeService.employeeDateWiseDataForGraph();
  }

  @Get('/taskDataForGraph')
  async getTaskDataForGraph(@CurrentUser() user: User) {
    return this.taskService.getTaskDataForGraphs();
  }

  @Get('/projectDataForGraph')
  async getProjectDataForGraph(@CurrentUser() user: User) {
    return this.projectManagementService.getProjectDataFOrGraph();
  }

  @Get('/projectApprovedDataForGraph')
  async getApprovedProjectDataForGraph(@CurrentUser() user: User) {
    return this.projectManagementService.getApprovedProjectDataFOrGraph();
  }

  @Get('/employeeHeadCountDataForGraph')
  async getdashBoardDataForGraph(@CurrentUser() user: User) {
    return this.dashBoardService.getdashBoardDataForGraph();
  }

  @Get('/invoiceDataForGraph')
  async getinvoiceDataForGraph(@CurrentUser() user: User) {
    return this.reviewOrderService.getInvoiceRaiseDataForGraph();
  }

  @Get('/orderDataForGraph')
  async getorderDataForGraph(@CurrentUser() user: User) {
    return this.orderService.orderSummeryDataFOrGraph();
  }

  @Get('/orderDateWiseDataForGraph')
  async getDateWiseDataForGraph(@CurrentUser() user: User) {
    return this.orderService.getOrderDataForGraph();
  }


  @Get('/paryrollStatusDataForGraph')
  async getparyrollStatusDataForGraph(@CurrentUser() user: User) {
    return this.payrollService.getPayrollStatusDataFOrGraph();
  }
}
