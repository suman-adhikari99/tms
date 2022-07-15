import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BenefitRepository } from 'src/benefits/benefits.repository';
import { ContractorRepository } from 'src/contractor/contractor.repository';
import { DeductionRepository } from 'src/deductions/deductions.repository';
import { EmployeeWorkService } from 'src/employee-work/employee-work.service';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { PayrollTeamsummaryRepository } from 'src/payroll-teamsummary/payroll-teamsummary.repository';
import { PayrollTeamsummaryService } from 'src/payroll-teamsummary/payroll-teamsummary.service';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { TaskRepository } from 'src/task/task.repository';
import { TeamSummaryRepositry } from 'src/team-summary/team-summary.repository';
import { User } from 'src/users/user.entity';
import { convertMSToHours, getObjectId, getString } from 'src/utilities';
import { PayRollDto } from './dto/create_payroll_dto';
import { PayrollRepository } from './payroll.repository';

@Injectable()
export class PayRollService {
  constructor(
    @InjectRepository(PayrollRepository)
    private payrollRepository: PayrollRepository,
    private projectRepository: ProjectManagement,
    private taskRepository: TaskRepository,
    private employeeRepository: EmployeeRepository,
    private teamSummaryRepositry: TeamSummaryRepositry,
    private profileDataRepository: ProfileDataRepository,
    private benefitRepository: BenefitRepository,
    private deductionRepository: DeductionRepository,
    private payrollTeamsummaryRepository: PayrollTeamsummaryRepository,
    private readonly employeeWorkService: EmployeeWorkService,
    private readonly contractorRepository: ContractorRepository,
  ) {}

  async getAll() {
    return this.payrollRepository.find();
  }
  async getPayrollStatusDataFOrGraph() {
    const pipeline = [
      {
        $group: {
          _id: '$status',
          count: {
            $sum: 1,
          },
        },
      },
    ];
    const payrollStatus = await this.payrollRepository
      .aggregate(pipeline)
      .toArray();
    const response = {
      label: [],
      data: [],
    };
    for (let data of payrollStatus) {
      response.label.push(data._id), response.data.push(data.count);
    }
    return response;
  }

  async createPayroll(payRollDto: PayRollDto) {
    const { projectValidity } = payRollDto;
    let startDate = projectValidity[0];
    let endDate = projectValidity[1];

    const project = await this.projectRepository.find({
      where: {
        'status.status': 'Project Closed',
        deliveryDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    });

    let projectTeamSummary = [];

    // await Promise.all(
    //   project.map(async (_, i) => {
    //     projectTeamSummary.push(...project[i].teamSummary);
    //   }),
    // );
    const payroll = await this.payrollRepository.create({
      ...payRollDto,
      status: 'New',
      adminStatus: '',
      // teamSummary: projectTeamSummary,
    });
    return this.payrollRepository.save(payroll);
  }

  async getById(id: string) {
    const objectId = getObjectId(id);
    const payroll = await this.payrollRepository.findOne(objectId);
    return payroll;
  }

  async getClosedProject(user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const project = await this.projectRepository.find({
        where: {
          'status.status': 'Project Closed',
        },
        order: {
          id: 'DESC',
        },
      });

      // set payrollStatus of projects to 'Pending'
      for (let i = 0; i < project.length; i++) {
        project[i].payrollStatus = 'Pending';
        // this.projectRepository.save(project[i]);
      }
      this.projectRepository.save(project);
      return project;
    } catch (error) {
      return error;
    }
  }

  // get closed task
  async getClosedTask(user: User) {
    try {
      console.log('hello');
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const project = await this.projectRepository.find({
        where: {
          'status.status': 'Project Closed',
        },
        order: {
          id: 'DESC',
        },
      });
      const projectIds = project.map((pro) => pro.id.toString());
      console.log('projectIds', projectIds);
      const tasks = await this.taskRepository.find({
        where: {
          projectId: { $in: projectIds },
        },
      });
      return tasks;
    } catch (error) {
      return error;
    }
  }

  // get cloded taskby project id
  async getClosedTaskByProjectId(projectId: string, user: User) {
    try {
      console.log('user', user);
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(objectId);
      if (!project) throw new NotFoundException('Project not found');
      // find if status of project is Project Closed

      // if (project.status) {
      //   throw new ForbiddenException('Project is not closed');
      // } else {
      const tasks = await this.taskRepository.find({
        where: {
          projectId,
        },
      });
      return tasks;
      // }
    } catch (error) {
      return error;
    }
  }

  async teamSummary1() {
    try {
      console.log('hello mmmmmmm');
      const project = await this.projectRepository.find({
        where: {
          'status.status': 'Project Closed',
        },
      });
      console.log('Project', project);
      await Promise.all(
        project.map(async (_, i) => {
          let teamSummary = [];
          await Promise.all(
            project[i].teamMember.map(async (teamMember) => {
              const employee = await this.employeeRepository.find({
                where: {
                  userId: teamMember.userId,
                },
              });
              console.log('employee of ', employee);
              if (employee.length > 0) {
                teamSummary.push({
                  employeeId: employee[0].id.toString(),
                  userId: employee[0].userId,
                  fullName: employee[0].fullName,
                  image: employee[0].image,
                  employmentType: employee[0].employmentType,
                  role: teamMember.role,
                  status: 'Pending',
                  salaryDetails: employee[0].salaryDetails,
                  paidTask: '9',
                  netPay: '7890',
                });
              }
              // console.log('project' + i, teamSummary);
            }),
          );
          project[i].teamSummary = teamSummary;
        }),
      );
      // console.log('Project123', project);
      return this.projectRepository.save(project);
    } catch (error) {
      return error;
    }
  }

  async teamSummary(projectClosure) {
    try {
      const projectObjectId = getObjectId(projectClosure.projectId);

      // const project = await this.projectRepository.findOne(projectObjectId);
      const projects = await this.projectRepository
        .aggregate([
          {
            $match: {
              _id: projectObjectId,
            },
          },
          {
            $lookup: {
              from: 'employeeWork',
              let: {
                projectId: {
                  $toString: '$_id',
                },
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$projectId', '$$projectId'],
                    },
                  },
                },
                {
                  $project: {
                    employeeId: 1,
                    taskId: 1,
                    taskTitle: 1,
                    taskType: 1,
                    status: 1,
                    prority: 1,
                    dueDate: 1,
                    payPerWord: 1,
                    numberOfWords: 1,
                    amount: 1,
                  },
                },
              ],
              as: 'projectTasks',
            },
          },
        ])
        .toArray();

      // find team member of project who is approved
      let teamSummary = [];
      let project = projects[0];

      for (let projectMember of project.teamMember) {
        let benefits: any;
        let deductions: any;
        let grossPay = 0;
        let totalBenefits = 0;
        let totalDeductions = 0;
        let netPay = 0;
        let projectTasksOfMember = [];

        if (!projectMember.isJoined) continue;

        const employee = await this.employeeRepository.findOne({
          where: {
            userId: projectMember.userId,
          },
        });

        if (!employee) continue;

        if (
          projectMember.role === 'CM' &&
          employee.employmentType.toLowerCase() === 'contractor'
        ) {
          let employeeSalaryDetails = employee.salaryDetails;

          const contractor = await this.contractorRepository.findOne({
            where: { groupName: employeeSalaryDetails.group },
          });

          if (!contractor) continue;

          for (let task of employee.tasks) {
            const selectedPaymentSpec = contractor.paymentSpec.find(
              (spec) =>
                spec.taskSettingName.toLowerCase() === task.toLowerCase(),
            );

            grossPay += parseInt(
              selectedPaymentSpec[
                this.employeeWorkService.priorityMapper(
                  employeeSalaryDetails.priority,
                )
              ],
            );
          }

          projectTasksOfMember = employee.tasks;

          benefits = await calculateBenefits(
            employee.salaryDetails.benefits ?? [],
            grossPay,
            this.benefitRepository,
          );

          deductions = await calculateDeductions(
            employee.salaryDetails.deduction ?? [],
            grossPay,
            this.deductionRepository,
          );

          totalBenefits = benefits.totalAmount;
          totalDeductions = deductions.totalAmount;
          netPay = grossPay + totalBenefits - totalDeductions;
        } else {
          if (employee.employmentType.toLowerCase() === 'contractor') {
            projectTasksOfMember = project.projectTasks.filter((task) => {
              task.employeeId === getString(employee.id);
            });

            grossPay = calculateContractorGrossPayment(
              projectTasksOfMember ?? [],
            );

            benefits = await calculateBenefits(
              employee.salaryDetails.benefits ?? [],
              grossPay,
              this.benefitRepository,
            );

            deductions = await calculateDeductions(
              employee.salaryDetails.deduction ?? [],
              grossPay,
              this.deductionRepository,
            );

            totalBenefits = benefits.totalAmount;
            totalDeductions = deductions.totalAmount;
            netPay = grossPay + totalBenefits - totalDeductions;
          } else if (employee.employmentType.toLowerCase() === 'inhouse') {
            grossPay = null;
            totalBenefits = null;
            totalDeductions = null;
            netPay = null;
          }
        }

        let tmp = {
          employeeId: employee.id.toString(),
          userId: employee.userId,
          fullName: employee.fullName,
          image: employee.image,
          employmentType: employee.employmentType,
          role: projectMember.role,
          status: 'Pending',
          salaryDetails: {
            group: employee.salaryDetails.group,
            benefits:
              benefits?.individualBenefitsAmount ??
              employee.salaryDetails.benefits,
            deductions:
              deductions?.individualDeductionsAmount ??
              employee.salaryDetails.benefits,
          },
          paidTask: projectTasksOfMember?.length ?? null,
          grossPay: grossPay,
          totalBenefits: totalBenefits,
          totalDeductions: totalDeductions,
          netPay: netPay,
        };

        teamSummary.push(tmp);
      }

      let updatedStatus = await this.projectRepository.update(projectObjectId, {
        teamSummary: teamSummary,
      });

      if (!updatedStatus) {
        throw new InternalServerErrorException('teamSummary Not updated');
      }

      delete project.projectTasks;
      return project;
    } catch (error) {
      return error;
    }
  }

  async add(projectId: string, userId: string) {
    try {
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne({
        where: {
          _id: objectId,
          teamMember: { $elemMatch: { userId: userId } },
        },
      });
      console.log('PPPP', project);
      // if (!project) {
      //   throw new NotFoundException('Project not found');
      // }
      // for (let i = 0; i < project.teamSummary.length; i++) {
      //   if (project.teamSummary[i].userId === userId) {
      //     project.teamSummary[i].status = 'Approved';
      //   }

      //   return this.projectRepository.save(project);
      // }
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }

  async approveTeamSummary(projectId: string, userId: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne({
        where: {
          _id: objectId,
          teamMember: { $elemMatch: { userId: userId } },
        },
      });
      console.log('PPPP', project);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      for (let i = 0; i < project.teamSummary.length; i++) {
        if (project.teamSummary[i].userId === userId) {
          project.teamSummary[i].status = 'Approved';
        }

        return this.projectRepository.save(project);
      }
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }

  // get all approved teamMember of project
  async getApprovedTeamMember(user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const project = await this.projectRepository.find({
        where: {
          'status.status': 'Project Closed',
        },
        order: {
          id: 'DESC',
        },
      });
      for (let i = 0; i < project.length; i++) {
        project[i].teamSummary = project[i].teamSummary.filter(
          (teamMember) => teamMember.status == 'Approved',
        );
      }
      console.log('Approved Team Member', project);
      return project;
    } catch (error) {
      console.log('Error >>', error);
      return error;
    }
  }

  async approveProjectTeamMember(user: User, projectId, userId) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const project = await this.projectRepository.findOne({
        where: {
          id: getObjectId(projectId),
          teamMember: { $elemMatch: { userId: userId } },
        },
      });

      for (let i = 0; i < project.teamMember.length; i++) {
        if (project.teamMember[i].userId == userId) {
          // project.teamMember[i].status = 'Approved';
        }
      }

      console.log('Approved Team Member', project);
      return project;
    } catch (error) {
      console.log('Error >>', error);
      return error;
    }
  }

  // get all approved teamMember of project between two dates
  async getApprovedTeamMemberBetweenDates(
    startDate: string,
    endDate: string,
    user: User,
  ) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      // check if deliveryDate of project is between startDate and endDate
      const project = await this.projectRepository.find({
        where: {
          'status.status': 'Project Closed',
          deliveryDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      });
      for (let i = 0; i < project.length; i++) {
        project[i].teamSummary = project[i].teamSummary.filter(
          (teamMember) => teamMember.status == 'Approved',
        );
      }
      console.log('Approved Team Member', project);
      return project;
    } catch (error) {
      console.log('Error >>', error);
      return error;
    }
  }

  async saveAndApprovedProject(id: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const objectId = getObjectId(id);
      const project = await this.projectRepository.findOne(objectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      project.payrollStatus = 'Processed';

      this.projectRepository.save(project);
      // this.payrollTeamsummaryService.payrollTeamSummary(project);
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }

  async saveAndApprovedPayroll(id: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const objectId = getObjectId(id);
      const payroll = await this.payrollRepository.findOne(objectId);
      if (!payroll) {
        throw new NotFoundException('Payroll not found');
      }

      payroll.status = 'Approved';
      payroll.adminStatus = 'Pending';

      this.payrollRepository.save(payroll);
      // this.payrollTeamsummaryService.payrollTeamSummary(project);
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }

  async runPayroll(id: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const objectId = getObjectId(id);
      const payroll = await this.payrollRepository.findOne(objectId);

      payroll.status = 'Approval Pending';

      this.payrollRepository.save(payroll);
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }
  // make payroll complete
  async makeCompletePayroll(id: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');

      const objectId = getObjectId(id);
      const payroll = await this.payrollRepository.findOne(objectId);
      if (!payroll) throw new NotFoundException('Pay Roll not found');
      payroll.status = 'Approved';
      payroll.adminStatus = 'Review Pending';

      return this.payrollRepository.save(payroll);
    } catch (error) {
      console.log('Error >>', error);
      throw new NotFoundException(error);
    }
  }

  // for payroll history
  // get all completed payroll
  async getCompletedPayroll(user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const payroll = await this.payrollRepository.find({
        where: {
          status: 'Completed',
        },
      });
      return payroll;
    } catch (error) {
      return error;
    }
  }

  async getNotCompletedPayroll(user: User) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      // find payroll whose status is not completed
      const payroll = await this.payrollRepository.find({
        where: {
          status: { $ne: 'Completed' },
        },
      });

      return payroll;
    } catch (error) {
      return error;
    }
  }

  async getAllEmployee(user) {
    if (!user.role.mainRoles.includes('PR'))
      throw new ForbiddenException('You are not Payroll Manager');

    const employees = await this.employeeRepository.find();

    const employeeEmail = employees.map((employee) => employee.personalEmail);

    console.log('Employyyyyy', employeeEmail);
    const profileData = await this.profileDataRepository.find({
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
          (profile) => profile.profileData.email === employees[i].personalEmail,
        ),
      });
    }
    return mapped;
  }

  async getTeamSummaryOfProject(user: User, projectId: string) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(objectId);
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project.teamSummary;
    } catch (error) {
      return error;
    }
  }

  async getTeamSummaryOfProjectBetweenDates(
    user: User,
    startDate: string,
    endDate: string,
  ) {
    try {
      if (!user.role.mainRoles.includes('PR'))
        throw new ForbiddenException('You are not Payroll Manager');
      const project = await this.projectRepository.find({
        where: {
          'status.status': 'Project Closed',
          deliveryDate: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      });
      for (let i = 0; i < project.length; i++) {
        project[i].teamSummary = project[i].teamSummary.filter(
          (teamMember) => teamMember.status == 'Approved',
        );
      }
      console.log('Approved Team Member', project);
      return project;
    } catch (error) {
      console.log('Error >>', error);
      return error;
    }
  }

  async adminApprove(payrollId: string, currentUser: User) {
    if (!(currentUser.role.activeRole === 'AM'))
      throw new ForbiddenException('Only admin can access.');

    const payroll = await this.payrollRepository.findOne(payrollId);

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    payroll.adminStatus = 'Approved';
    return this.payrollRepository.save(payroll);
  }

  async adminPaid(payrollId: string, currentUser: User) {
    if (!(currentUser.role.activeRole === 'AM'))
      throw new ForbiddenException('Only admin can access.');

    const payroll = await this.payrollRepository.findOne(payrollId);

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    payroll.adminStatus = 'Paid';

    const payrollTeamsummary = await this.payrollTeamsummaryRepository.find({
      where: {
        payrollId: payrollId,
      },
    });

    payrollTeamsummary.forEach((employee) => {
      employee.paymentStatus = 'Paid';
    });

    await this.payrollTeamsummaryRepository.save(payrollTeamsummary);
    return this.payrollRepository.save(payroll);
  }

  async getAdminPaidPayroll(currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'AM' ||
        currentUser.role.activeRole === 'PR'
      )
    )
      throw new ForbiddenException(
        'Only admin and payroll manager can access.',
      );

    const payroll = await this.payrollRepository.find({
      where: {
        adminStatus: 'Paid',
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payrolls not found');
    }

    return payroll;
  }

  async getAdminUnpaidPayroll(currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'AM' ||
        currentUser.role.activeRole === 'PR'
      )
    )
      throw new ForbiddenException(
        'Only admin and payroll manager can access.',
      );

    const payroll = await this.payrollRepository.find({
      where: {
        adminStatus: { $ne: 'Paid' },
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payrolls not found');
    }

    return payroll;
  }

  async archivePayroll(payrollId: string, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'AM' ||
        currentUser.role.activeRole === 'PR'
      )
    )
      throw new ForbiddenException(
        'Only admin and payroll manager can access.',
      );

    const payroll = await this.payrollRepository.findOne(payrollId);

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    payroll.status = 'Archived';
    return this.payrollRepository.save(payroll);
  }
}

export function calculateInhouseGrossPayment(
  baseTime: number,
  overTime: number,
  basePay: number,
): number {
  // TODO:: extra pay for over time not considered
  let basePayment = convertMSToHours(baseTime) * basePay;
  let overtimePayment = convertMSToHours(overTime) * basePay;

  return basePayment + overtimePayment;
}

export function calculateContractorGrossPayment(tasks: any[]): number {
  return tasks.reduce((acc, task) => {
    return acc + task.amount;
  }, 0);
}

export async function calculateBenefits(
  benefits: string[],
  grossAmount: number,
  benefitRepository: BenefitRepository,
) {
  let totalFixedAmount = 0;
  let totalPercentageAmount = 0;
  let individualBenefitsAmount = {};

  let tmp = await benefitRepository.find({
    where: {
      name: { $in: [...benefits] },
    },
  });

  tmp.forEach((item) => {
    if (item.calculationType === 'Fixed Amount' && item.status === 'active') {
      // TODO:: calculate tax if taxable
      individualBenefitsAmount[item.name] = Number(item.amount);
      totalFixedAmount += Number(item.amount);
    } else if (
      item.calculationType === 'Percentage of Gross Pay' &&
      item.status === 'active'
    ) {
      individualBenefitsAmount[item.name] =
        (Number(item.amount) / 100) * grossAmount;
      totalPercentageAmount += (Number(item.amount) / 100) * grossAmount;
    }
  });

  return {
    totalAmount: totalFixedAmount + totalPercentageAmount,
    individualBenefitsAmount,
  };
}

export async function calculateDeductions(
  deductions: string[],
  grossAmount: number,
  deductionRepository: DeductionRepository,
) {
  let totalFixedAmount = 0;
  let totalPercentageAmount = 0;
  let individualDeductionsAmount = {};

  let tmp = await deductionRepository.find({
    where: {
      name: { $in: [...deductions] },
    },
  });

  tmp.forEach((item) => {
    if (item.calculationType === 'Fixed Amount' && item.status === 'active') {
      // TODO:: deductionFrequency
      individualDeductionsAmount[item.name] = Number(item.amount);
      totalFixedAmount += Number(item.amount);
    } else if (
      item.calculationType === 'Percentage of Gross Pay' &&
      item.status === 'active'
    ) {
      individualDeductionsAmount[item.name] =
        (Number(item.amount) / 100) * grossAmount;
      totalPercentageAmount += (Number(item.amount) / 100) * grossAmount;
    }
  });

  return {
    totalAmount: totalFixedAmount + totalPercentageAmount,
    individualDeductionsAmount,
  };
}
