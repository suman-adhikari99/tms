import { Injectable, NotFoundException } from '@nestjs/common';
import { BenefitRepository } from 'src/benefits/benefits.repository';
import { ContractorTracksService } from 'src/contractor-tracks/contractor-tracks.service';
import { DeductionRepository } from 'src/deductions/deductions.repository';
import { InHouseRepository } from 'src/inhouse/inhouse.repository';
import { PayrollRepository } from 'src/payroll/payroll.repository';
import {
  calculateBenefits,
  calculateDeductions,
  calculateInhouseGrossPayment,
} from 'src/payroll/payroll.service';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { User } from 'src/users/user.entity';
import { getString } from 'src/utilities';
import { PayrollTeamsummaryRepository } from './payroll-teamsummary.repository';

@Injectable()
export class PayrollTeamsummaryService {
  constructor(
    private readonly contractorTracksService: ContractorTracksService,
    private projectRepository: ProjectManagement,
    private benefitRepository: BenefitRepository,
    private deductionRepository: DeductionRepository,
    private inHouseRepository: InHouseRepository,
    private payrollRepository: PayrollRepository,
    private payrollTeamsummaryRepository: PayrollTeamsummaryRepository,
  ) {}

  async payrollTeamSummaryById(id: string, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'AM' ||
        currentUser.role.activeRole === 'PR'
      )
    )
      throw new NotFoundException(
        'Only admins and payroll manager can access.',
      );

    let payrollTeamsummary = await this.payrollTeamsummaryRepository.find({
      where: {
        payrollId: id,
      },
    });

    if (payrollTeamsummary && payrollTeamsummary.length > 0)
      return payrollTeamsummary;

    let payroll = await this.payrollRepository.findOne(id);
    let startDate = payroll.projectValidity[0];
    let endDate = payroll.projectValidity[1];

    let pipeline = [
      {
        $match: {
          $and: [
            {
              payrollStatus: 'Processed',
            },
            {
              deliveryDate: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          payrollStatus: 1,
          deliveryDate: 1,
          deliveryPlan: 1,
          teamMember: 1,
          teamSummary: 1,
        },
      },
    ];

    const processedProjects = await this.projectRepository
      .aggregate(pipeline)
      .toArray();
    let inHouseGroups = await this.inHouseRepository.find();

    let projectIndex = 0;
    let employee = [];
    let projectIds = [];

    for (let project of processedProjects) {
      let projectId = getString(project._id);

      for (let member of project.teamSummary) {
        let existingTeamMember = employee.find(
          (e) => e.employeeId === member.employeeId,
        );

        if (existingTeamMember) {
          let existingProjectIndex = projectIds.findIndex(
            (e) => e === projectId,
          );

          if ((existingTeamMember.employmentType).toLowerCase() === 'inhouse') {
            if (existingProjectIndex !== -1) {
              existingTeamMember['projects'][existingProjectIndex]['role'] = [
                ...existingTeamMember['projects'][existingProjectIndex]['role'],
                member.role,
              ];
            } else {
              existingTeamMember['projects'].push({
                id: projectId,
                title: project.title,
                deliveryDate: project.deliveryDate,
                payrollStatus: project.payrollStatus,
                role: [member.role],
              });
            }

            continue;
          }

          if (existingProjectIndex !== -1) {
            existingTeamMember['projects'][existingProjectIndex]['role'] = [
              ...existingTeamMember['projects'][existingProjectIndex]['role'],
              member.role,
            ];
            existingTeamMember['projects'][existingProjectIndex]['amount'] =
              Number(
                existingTeamMember['projects'][existingProjectIndex]['amount'],
              ) + Number(member.netPay);
          } else {
            existingTeamMember['projects'].push({
              id: projectId,
              title: project.title,
              deliveryDate: project.deliveryDate,
              payrollStatus: project.payrollStatus,
              role: [member.role],
              amount: Number(member?.netPay ?? 0),
            });
          }

          // let existingRoles = Object.keys(existingTeamMember.payment);
          let existingRoles = existingTeamMember.payment.reduce((last, curr) => {
            last.push(curr.role);
            return last;
          }, []);

          if (existingRoles.indexOf(member.role) !== -1) {
            let tmp = existingTeamMember['payment'].find(payment => payment.role === member.role);

            existingTeamMember['payment'][member.role] = {
              grossPay: Number(tmp.grossPay) + Number(member.grossPay),
              totalBenefits:
                Number(tmp.totalBenefits) + Number(member.totalBenefits),
              totalDeductions:
                Number(tmp.totalDeductions) + Number(member.totalDeductions),

              // TODO:: add values for individual items in salaryDetails as well
              salaryDetails: member.salaryDetails,
              netPay: Number(tmp.netPay) + Number(member.netPay),
            };
          } else {
            existingTeamMember['payment'].push({
              role: member.role,
              grossPay: member?.grossPay ?? null,
              totalBenefits: member?.totalBenefits ?? null,
              totalDeductions: member?.totalDeductions ?? null,
              salaryDetails: member?.salaryDetails,
              netPay: member?.netPay ?? null,
            });
          }
        } else {
          if (
            (member.employmentType).toLowerCase() === 'contractor' &&
            member.status !== 'Approved'
          )
            continue;

          let tmp = {
            createdDate: new Date().toISOString(),
            payrollId: id,
            employeeId: member.employeeId,
            employeeName: member.fullName,
            paymentStatus: 'Pending',
            employeeImage: member.image,
            employmentType: member.employmentType,
            payment: [],
            projects: [],
          };

          if ((member.employmentType).toLowerCase() === 'inhouse') {
            let employeeGroup = inHouseGroups.find(
              (item) => member.salaryDetails.group === item.groupName,
            );

            let memberTimeTrack =
              await this.contractorTracksService.getTotalTrackBetweenDateInMS(
                member.userId,
                startDate,
                endDate,
              );

            let grossPay = calculateInhouseGrossPayment(
              memberTimeTrack.totalBaseTimeMS,
              memberTimeTrack.totalOvertimeMS,
              Number(employeeGroup.basePayPerHour),
            );

            // calculate grosspayment for each day as well
            for (let track of memberTimeTrack.tracks) {
              track['payment'] = calculateInhouseGrossPayment(
                track.totalBaseTimeMS,
                track.totalOvertimeMS,
                Number(employeeGroup.basePayPerHour),
              );
            }

            let benefits = await calculateBenefits(
              member.salaryDetails.benefits ?? [],
              grossPay,
              this.benefitRepository,
            );

            let deductions = await calculateDeductions(
              member.salaryDetails.deduction ?? [],
              grossPay,
              this.deductionRepository,
            );

            let totalBenefits = Number(benefits.totalAmount);
            let totalDeductions = Number(deductions.totalAmount);

            let netPay = grossPay + totalBenefits - totalDeductions;

            tmp['payPerHour'] = employeeGroup.basePayPerHour;
            tmp['trackedTime'] = memberTimeTrack.tracks;
            tmp['payment'].push({
              grossPay: grossPay,
              totalBenefits: totalBenefits,
              totalDeductions: totalDeductions,
              salaryDetails: {
                ...member.salaryDetails,
                benefits: benefits.individualBenefitsAmount,
                deductions: deductions.individualDeductionsAmount,
              },
              netPay: netPay,
            });

            tmp['projects'].push({
              id: projectId,
              title: project.title,
              deliveryDate: project.deliveryDate,
              payrollStatus: project.payrollStatus,
              role: [member.role],
            });
          } else {
            tmp['payment'].push({
              role: member.role,
              grossPay: member?.grossPay ?? null,
              totalBenefits: member?.totalBenefits ?? null,
              totalDeductions: member?.totalDeductions ?? null,
              salaryDetails: member?.salaryDetails,
              netPay: member?.netPay ?? null,
            });

            tmp['projects'].push({
              id: projectId,
              title: project.title,
              deliveryDate: project.deliveryDate,
              payrollStatus: project.payrollStatus,
              role: [member.role],
              amount: Number(member?.netPay ?? 0),
            });
          }

          employee.push(tmp);
        }

        if (projectIndex === 0) projectIds.push(projectId);
        projectIndex++;
      }
    }

    if (employee.length > 0)
      await this.payrollTeamsummaryRepository.save(employee);

    return employee;
  }

  async approveEmployeePaymentStatus(employeeId: string, payrollId: string, currentUser: User) {
    if (
      !(
        currentUser.role.activeRole === 'AM' ||
        currentUser.role.activeRole === 'PR'
      )
    )
      throw new NotFoundException(
        'Only admins and payroll manager can access.',
      );

    let employeePayroll = await this.payrollTeamsummaryRepository.findOne({
      where: {
        payrollId: payrollId,
        employeeId: employeeId
      },
    });

    employeePayroll.paymentStatus = "Approved";
    await this.payrollTeamsummaryRepository.save(employeePayroll);

    return employeePayroll;
  }
}
