import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { DepartmentRepository } from 'src/department/department.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { OrderRepository } from 'src/orders/order.repository';
import { PayrollRepository } from 'src/payroll/payroll.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { TerminateRepository } from 'src/terminate/terminate.repository';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';
import { BenefitRepository } from 'src/benefits/benefits.repository';
import { PayrollTeamsummaryRepository } from 'src/payroll-teamsummary/payroll-teamsummary.repository';

@Injectable()
export class AdminService {
  constructor(
    private orderRepository: OrderRepository,
    private projectRepository: ProjectManagement,
    private userRepository: UserRepository,
    private profileRepository: ProfileDataRepository,
    private employeeRepository: EmployeeRepository,
    private assistanceRequestRepository: AssistanceRequestsRepository,
    private reviewOrderRepository: ReviewOrderRepository,
    private notificationService: NotificationsService,
    private terminateRepository: TerminateRepository,
    private payrollRepository: PayrollRepository,
    private departmentRepository: DepartmentRepository,
    private benefitRepository: BenefitRepository,
    private payrollTeamsummaryRepository: PayrollTeamsummaryRepository,
  ) {}

  async getAllOrders(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    return this.orderRepository.find();
  }

  async getAllProjects(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    return this.projectRepository.find();
  }

  async getAllAssistanceRequests(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    return this.assistanceRequestRepository.find();
  }

  getAllClientUsers(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    console.log('hello');
    return this.userRepository.find({
      where: { 'role.activeRole': 'CU' },
    });
  }

  // delete client-user by id
  async deleteClientUser(id) {
    const objectId = getObjectId(id);
    const user = await this.userRepository.findOne(objectId);
    if (!user) throw new NotFoundException('User not found');

    const profileData = await this.profileRepository.findOne({
      where: { userId: id },
    });

    this.userRepository.delete(id);
    if (!profileData) return;
    this.profileRepository.delete(profileData.id);
  }

  // all invoices of a client
  async getAllClientInvoices(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const reviewOrder = await this.reviewOrderRepository.find({
      where: {
        quotationStatus: 'Invoiced',
      },
    });

    const userIds = reviewOrder.map((order) => order.userId);
    // console.log('userIds >>', userIds);

    const userIdsFiltered = userIds.filter((id) => id !== '');
    // console.log('userIdsFiltered >', userIdsFiltered);

    const userIdsFilteredObjectId = userIdsFiltered.map((id) =>
      getObjectId(id),
    );
    // console.log('userIdsFilteredObjectId >>>>>', userIdsFilteredObjectId);

    const users = await this.userRepository.find({
      where: {
        _id: { $in: userIdsFilteredObjectId },
      },
    });

    let mapped = [];

    // push review order and user to mapped in one object of same userId
    for (let i = 0; reviewOrder.length > i; i++) {
      mapped.push({
        reviewOrder: reviewOrder[i],
        user: users.find(
          (user) => user.id.toString() === reviewOrder[i].userId,
        ),
      });
    }
    return mapped;

    // return { users, reviewOrder, totalCost };
  }

  async getAllEmployee(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const employees = await this.employeeRepository.find();

    const employeeEmail = employees.map((employee) => employee.workEmail);

    console.log('Employyyyyy', employeeEmail);

    // const employeeEmailFiltered= employeeEmail.filter((email) => email !== '');

    // const employeeFilteredObjectId = employeeEmail.map((id) => getObjectId(id));

    const profileData = await this.profileRepository.find({
      where: {
        'profileData.email': { $in: employeeEmail },
      },
    });

    console.log('Profile', profileData);

    let mapped = [];
    // push review order and user to mapped in one object of same userId
    for (let i = 0; employees.length > i; i++) {
      mapped.push({
        employees: employees[i],
        profileData: profileData.find(
          (profile) => profile.profileData.email === employees[i].workEmail,
        ),
      });
    }
    return mapped;
  }

  async totalIncome(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const reviewOrder = await this.reviewOrderRepository.find({
      where: {
        quotationStatus: 'Invoiced',
      },
    });

    let totalServiceCost = [];

    for (let i = 0; reviewOrder.length > i; i++) {
      totalServiceCost.push(reviewOrder[i].totalServiceCost);
    }

    console.log('Total', totalServiceCost);
    const reducer = (accumulator, curr) => accumulator + curr;
    let totalCost = totalServiceCost.reduce(reducer);
    return totalCost;
  }

  async totalExpense(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const reviewOrder = await this.reviewOrderRepository.find({
      where: {
        'invoice.status': 'Paid',
      },
    });

    let totalServiceCost = [];

    for (let i = 0; reviewOrder.length > i; i++) {
      totalServiceCost.push(reviewOrder[i].totalServiceCost);
    }

    console.log('Total', totalServiceCost);
    const reducer = (accumulator, curr) => accumulator + curr;
    let totalCost = totalServiceCost.reduce(reducer);
    return totalCost;
    console.log('Rev Expense', reviewOrder);
  }

  // notification for admin of delivery date
  async deliveryDateNotification() {
    const reviewOrders = await this.reviewOrderRepository.find();

    const currentDate = new Date();
    console.log('current date', currentDate);

    // calculate delivery date by adding planSchedule of deliveryPlan plus orderDate
    const deliveryDate = reviewOrders.map((order) => {
      console.log('order >>>>>>>>>>', order);
      var result = new Date(order.orderDate);
      result.setDate(result.getDate() + order.deliveryPlan.planSchedule + 1);

      if (result > currentDate) {
        console.log('delivery date heyyyyyyyyyyyyy', result);
        this.notificationService.overdueNoticeForAdmin(order);
      }
    });
  }

  // get all terminated employees
  async getAllTerminatedEmployee(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const terminatedEmployees = await this.terminateRepository.find();
    return terminatedEmployees;
  }

  async approvePayroll(user, id) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const objectId = getObjectId(id);
    const payroll = await this.payrollRepository.findOne(objectId);
    if (!payroll) throw new NotFoundException('Payroll not found');

    payroll.status = 'Approved';
    payroll.adminStatus = 'Review Pending';
  }

  async markAsPaid(id, user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const objectId = getObjectId(id);
    const payroll = await this.payrollRepository.findOne(objectId);
    if (!payroll) throw new NotFoundException('Payroll not found');

    payroll.status = 'Completed';
    payroll.adminStatus = 'Paid';
  }

  async getAllPaidPayroll(user) {
    if (!(user.role.activeRole === 'AM' || user.role.activeRole === 'PR'))
      throw new NotFoundException(
        'Only admins and payroll manager can access.',
      );

    const payroll = await this.payrollRepository.find({
      where: {
        status: 'Completed',
        adminStatus: 'Paid',
      },
    });
    return payroll;
  }

  // get all department
  async getAllDepartment(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');

    const department = await this.departmentRepository.find();
    return department;
  }

  async getBenifitDetails(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    const benefit_type = await this.benefitRepository.distinct('name', {});
    const payrollTeamSummary = await this.payrollTeamsummaryRepository.find();
    let benefits = {};
    benefit_type.forEach((element) => {
      benefits[element] = 0;
    });
    for (let pts of payrollTeamSummary) {
      for (let pay of pts.payment) {
        for (let key in benefits) {
          benefits[key] += pay.salaryDetails.benefits[key];
        }
      }
    }
    return benefits;
  }

  async dateWiseBenifitDetails(dateFilter) {
    const benefit_type = await this.benefitRepository.distinct('name', {});
    const payrollTeamSummary = await this.payrollTeamsummaryRepository.find({
      order: {
        createdDate: 'ASC',
      },
      where: {
        createdDate: dateFilter,
      },
    });
    let benefits = {};
    benefit_type.forEach((element) => {
      benefits[element] = 0;
    });
    for (let pts of payrollTeamSummary) {
      for (let pay of pts.payment) {
        for (let key in benefits) {
          pay.salaryDetails.benefits[key]
            ? (benefits[key] += pay.salaryDetails.benefits[key])
            : (benefits[key] = 0);
        }
      }
    }
    return { label: Object.keys(benefits), data: Object.values(benefits) };
  }

  async getThisYearsBenifitDetails(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    const dateFilter = {
      $gte: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      $lte: new Date(new Date().getFullYear(), 11, 31).toISOString(),
    };
    return this.dateWiseBenifitDetails(dateFilter);
  }

  async getThisMonthsBenifitDetails(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    const now = new Date();
    const dateFilter = {
      $gte: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
    };
    return this.dateWiseBenifitDetails(dateFilter);
  }

  async getThisWeeksBenifitDetails(user) {
    if (!user.role.mainRoles.includes('AM'))
      throw new ForbiddenException('You are not Admin');
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;
    const dateFilter = {
      $gte: new Date(curr.setDate(first)).toISOString(),
      $lte: new Date(curr.setDate(last)).toISOString(),
    };
    return this.dateWiseBenifitDetails(dateFilter);
  }

  async getDateWiseDataOFBenefitsForGraph(user) {
    return {
      year: await this.getThisYearsBenifitDetails(user),
      month: await this.getThisMonthsBenifitDetails(user),
      week: await this.getThisWeeksBenifitDetails(user),
    };
  }
}
