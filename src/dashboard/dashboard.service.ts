import { Injectable } from '@nestjs/common';
import { number } from 'joi';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getString } from 'src/utilities';
import { IProjectWiseEarningResponse } from './interfaces';

@Injectable()
export class DashboardService {
  constructor(
    private projectRepository: ProjectManagement,
    private userRepository: UserRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async getProjectWiseEarning(currentUser: User) {
    const userId = getString(currentUser.id);
    // const userId = '629c574e100934f8f76d1c2f';

    let projects = await this.projectRepository.find({
      where: {
        teamSummary: { $elemMatch: { userId: userId } },
      },
    });

    let response: IProjectWiseEarningResponse[] = [];
    projects.forEach((project) => {
      let user = project.teamSummary.filter(
        (member) => member.userId === userId,
      );

      let res = {
        projectId: getString(project.id),
        projectNumber: project.projectNumber,
        projectTitle: project.title,
        payrollStatus: project.payrollStatus,
        netPay: {},
      };

      user.forEach((item) => {
        res['netPay'][item.role] = item.netPay;
      });

      response.push(res);
    });

    return response;
  }

  async getdashBoardDataForGraph() {
    const userRolepipeline = [
      {
        $addFields: {
          mainRoles: '$role.mainRoles',
        },
      },
      {
        $project: {
          mainRoles: 1,
        },
      },
      {
        $unwind: {
          path: '$mainRoles',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: '$mainRoles',
          count: {
            $sum: 1,
          },
        },
      },
    ];
    const employeeTypePipeline = [
      {
        $group: {
          _id: '$employmentType',
          count: {
            $sum: 1,
          },
        },
      },
    ];

    const departmentTypePipeline = [
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];
    const userRole = await this.userRepository
      .aggregate(userRolepipeline)
      .toArray();
    const employeeType = await this.employeeRepository
      .aggregate(employeeTypePipeline)
      .toArray();
    const departmentType = await this.employeeRepository
      .aggregate(departmentTypePipeline)
      .toArray();
    let output = {
      roles: {
        label: [],
        data: [],
      },
      employees: {
        label: [],
        data: [],
      },
      departments: {
        label: [],
        data: [],
      },
    };
    let otherTotal = 0;
    for (let data of userRole) {
      output.roles.label.push(data._id);
      output.roles.data.push(data.count);
    }
    for (let data of employeeType) {
      output.employees.label.push(data._id);
      output.employees.data.push(data.count);
    }

    for (let data in departmentType) {
      if (Number(data) < 4) {
        output.departments.label.push(departmentType[data]._id);
        output.departments.data.push(departmentType[data].count);
      } else if (Number(data) === departmentType.length-1 ) {
        otherTotal = otherTotal + departmentType[data].count;
        output.departments.label.push('Others');
        output.departments.data.push(otherTotal);
      } else if (Number(data) >= 4) {
        otherTotal = otherTotal + departmentType[data].count;
      }
    }
    return output;
  }
}
