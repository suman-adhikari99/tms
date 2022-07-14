import { Injectable } from '@nestjs/common';
import { ContractorRepository } from 'src/contractor/contractor.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { PayrollTeamsummaryService } from 'src/payroll-teamsummary/payroll-teamsummary.service';

import { ProjectManagement } from 'src/projects/project-management.repository';
import { TaskSettingRepository } from 'src/task-settings/task-settings.repository';
import { TaskRepository } from 'src/task/task.repository';
import { getObjectId } from 'src/utilities';
import { EmployeeWorkRepository } from './employee-work.repository';

@Injectable()
export class EmployeeWorkService {
  constructor(
    private projectRepository: ProjectManagement,
    private employeeRepository: EmployeeRepository,
    private taskRepository: TaskRepository,
    private employeeWorkRepository: EmployeeWorkRepository,
    private contractorRepository: ContractorRepository,
    private taskSetting: TaskSettingRepository,
    private payrollTeamsummaryService: PayrollTeamsummaryService,
  ) {}

  priorityMapper = (priority) => {
    if (priority.toLowerCase() === 'high priority') {
      return 'highPriorityPay';
    } else if (priority.toLowerCase() === 'medium priority') {
      return 'mediumPriorityPay';
    } else {
      return 'lowPriorityPay';
    }
  };

  async calculatePPU(employee, taskSetting, priority) {
    //find employ by userId
    if (employee.employmentType == 'Contractor') {
      const contractor = await this.contractorRepository.find({
        where: { groupName: employee.salaryDetails.group },
      });
      const selectedPaymentSpec = contractor[0].paymentSpec.filter(
        (spec) => spec.taskSettingName == taskSetting,
      );
      return parseInt(
        selectedPaymentSpec[0][await this.priorityMapper(priority)],
      );
    }
    return 0;
  }

  async employeeDetails(projectClosure) {
    const projectObjectId = getObjectId(projectClosure.projectId);
    const project = await this.projectRepository.findOne(projectObjectId);
    // find CE and QA in this project
    let qa = '';
    let ce = '';
    project.teamMember.filter((teamMember) => {
      if (teamMember.role == 'QA') {
        qa = teamMember.userId;
      }
      if (teamMember.role == 'CE') {
        ce = teamMember.userId;
      }
    });

    const tasks = await this.taskRepository.find({
      where: {
        projectId: projectClosure.projectId,
      },
    });

    let money;
    let pMoney; // just a declaration due to error for down part
    let employeeQA;
    let employeeCE;
    console.log(tasks);
    tasks.map((task) => {
      let employee;
      Promise.all(
        task.teamMember.map(async (member) => {
          console.log('member.userId', member.userId);
          employee = await this.employeeRepository.findOne({
            userId: member.userId.toString(),
          });

          console.log('Employeeeee', employee);

          const ppu = await this.calculatePPU(
            employee,
            task.taskSetting,
            task.priority,
          );
          money = parseInt(task.numberOfWords) * ppu;
          pMoney = ppu;
          const eW = this.employeeWorkRepository.create({
            employeeId: employee.id.toString(),
            projectId: projectClosure.projectId.toString(),
            taskId: task.id.toString(),
            priority: task.priority,
            dueDate: task.dueDate,
            taskTitle: task.title,
            taskType: task.taskType,
            payPerWord: ppu.toString(),
            role: member.role,
            amount: parseInt(task.numberOfWords) * ppu,
            totalAmount: 'calculate yourself',
            fullName: employee.fullName,
            employeeType: employee.employmentType,
            status: employee.status,
            numberOfWords: task.numberOfWords,
            assignedtask: 'totalTasks',
            completedTask: 'taskCompleted',
            pendingTask: 'taskPending',
            image: employee.image,
            paidTasks: 'paidTasks',
          });
          this.employeeWorkRepository.save(eW);
          this.payrollTeamSummary(eW);
        }),
      );
      //add  QA
      let c = 0;
      Promise.all(
        project.teamMember.map(async (member) => {
          if (member.role == 'QA') {
            employeeQA = await this.employeeRepository.findOne({
              where: {
                userId: member.userId,
              },
            });
            console.log('EmployeeQA', employeeQA);

            if (c === 1) {
              return;
            }
            const ppu = await this.calculatePPU(
              employeeQA,
              task.taskSetting,
              task.priority,
            );

            if (c === 0) {
              const qaEmployeeWork = this.employeeWorkRepository.create({
                employeeId: employeeQA.id.toString(),
                projectId: projectClosure.projectId.toString(),
                taskId: task.id.toString(),
                priority: task.priority,
                dueDate: task.dueDate,
                taskTitle: task.title,
                taskType: task.taskType,
                payPerWord: ppu.toString(),
                role: 'QA',
                // amount: money,
                amount: parseInt(task.numberOfWords) * ppu,

                totalAmount: 'calculate yourself',
                fullName: employeeQA.fullName,
                employeeType: employeeQA.employmentType,
                status: employeeQA.status,
                numberOfWords: task.numberOfWords,
                assignedtask: 'totalTasks',
                completedTask: 'taskCompleted',
                pendingTask: 'taskPending',
                image: employeeQA.image,
                paidTasks: 'paidTasks',
              });
              console.log('QA Employee', employeeQA);
              this.employeeWorkRepository.save(qaEmployeeWork);
              c = 1;
              this.payrollTeamSummary(qaEmployeeWork);
              return;
            }
          }
        }),
      );
      // add CE
      let count = 0;
      Promise.all(
        project.teamMember.map(async (member) => {
          if (member.role == 'CE') {
            employeeCE = await this.employeeRepository.findOne({
              where: {
                userId: member.userId,
              },
            });

            console.log('EmployeeCEEE', employeeCE);

            if (count === 1) {
              return;
            }
            const ppu = await this.calculatePPU(
              employeeCE,
              task.taskSetting,
              task.priority,
            );

            if (count === 0) {
              const ceEmployeeWork = this.employeeWorkRepository.create({
                employeeId: employeeCE.id.toString(),
                projectId: projectClosure.projectId.toString(),
                taskId: task.id.toString(),
                priority: task.priority,
                dueDate: task.dueDate,
                taskTitle: task.title,
                taskType: task.taskType,
                payPerWord: ppu.toString(),
                // payPerWord: pMoney.toString(),
                role: 'QA',

                amount: parseInt(task.numberOfWords) * ppu,
                totalAmount: 'calculate yourself',
                fullName: employeeCE.fullName,
                employeeType: employeeCE.employmentType,
                status: employeeCE.status,
                numberOfWords: task.numberOfWords,
                assignedtask: 'totalTasks',
                completedTask: 'taskCompleted',
                pendingTask: 'taskPending',
                image: employeeCE.image,
                paidTasks: 'paidTasks',
              });
              console.log('QA Employee', employeeCE);
              this.employeeWorkRepository.save(ceEmployeeWork);
              count = 1;
              this.payrollTeamSummary(ceEmployeeWork);
            }
          }
        }),
      );
    });
  }

  async payrollTeamSummary(projectClosure) {
    const projectObjectId = getObjectId(projectClosure.projectId);
    const project = await this.projectRepository.findOne(projectObjectId);
    // get all teamSummary whose status is pending of project
    const teamSummary = project.teamSummary.filter(
      (teamMember) => teamMember.status == 'Pending',
    );
    console.log('Team Summary', teamSummary);
  }

  async getProjects(eId: string) {
    console.log('He p');
    const project = await this.employeeWorkRepository.find({
      where: {
        projectId: { $exists: true },
        employeeId: eId,
      },
    });
    return project;
  }

  async getTasks(eId: string) {
    console.log('He tts');
    const task = await this.employeeWorkRepository.find({
      where: {
        employeeId: eId,
        taskId: { $exists: true },
      },
    });
    return task;
  }
}

// let pts = await this.projectRepository
//   .aggregate([
//     {
//       $unwind: '$teamSummary',
//     },
//     {
//       $match: { 'teamSummary.status': 'Pending' },
//     },

//     {
//       $lookup: {
//         from: 'employee',
//         localField: 'teamSummary.userId',
//         foreignField: '_id',
//         as: 'emplo',
//       },
//     },
//   ])
//   .toArray();
// console.log('pts', pts);
// return pts;

// const tasks = await this.taskRepository.find({
//   join: {
//     alias: 'task',
//     innerJoinAndSelect: {
//       projects: 'task.projectId',
//     },
//   },
// });

// const tasks = await this.taskRepository.find({
//   relations: ['project'],
//   where: {
//     project: {
//       'status.status': 'Project Closed',
//     },
//   },
// });

// // get all member's userId of project and task. Check if userId isnot multiple then add it to array
// const userIds = [];

// task.map((_, i) => {
//   task[i].teamMember.forEach((member) => {
//     userIds.push(member.userId);
//   });
// });
// const uniqueUserIds = [...new Set(userIds)];

// project.teamMember.forEach((member) => {
//   uniqueUserIds.push(member.userId);
// });

// // make all unique values of userIds
// console.log('uniqueUserIds', uniqueUserIds);

// projectId: projectClosure.projectId.toString(),
// taskId: task.id.toString(),
// priority: task.priority,
// userId: member.userId,
// dueDate: task.dueDate, // authenticated
// createdDate: new Date().toISOString(), // not authenticate date
// taskTitle: task.title,
// taskType: task.taskType,
// payPerWord: ppu,
// role: member.role,
// amount: parseInt(task.numberOfWords) * ppu,
// totalAmount: '400',
// fullName: member.name,
// employeeType: employee.employmentType,
// status: employee.status,
// numberOfWords: task.numberOfWords,
// assignedtask: 'totalTasks',
// completedTask: 'taskCompleted',
// pendingTask: 'taskPending',
// employeeId: 'employee[0].id',
// image: employee.image,
// paidTasks: 'paidTasks',

//           console.log('employee', employee);
//           if (employee.length > 0) {
//             const eW = await this.employeeWorkRepository.create({
//               taskId: task[i].id.toString(),
//               priority: task[i].priority,
//               userId: employee[0].userId,
//               dueDate: task[i].dueDate, // authenticated
//               createdDate: new Date().toISOString(), // not authenticate date
//               taskTitle: task[i].title,
//               taskType: task[i].taskType,
//               payPerWord: '9',
//               role: employee[0].role.activeRole,
//               amount: '200',
//               totalAmount: '400',
//               assignedtask: totalTasks.toString(),
//               completedTask: taskCompleted.toString(),
//               pendingTask: taskPending.toString(),
//               employeeId: employee[0].id.toString(),
//               fullName: employee[0].fullName,
//               employeeType: employee[0].employmentType,
//               status: employee[0].status,
//               numberOfWords: task[i].numberOfWords,
//             });
//             this.employeeWorkRepository.save(eW);
//           }
//         }),
//       );
//     }),
//   );

//   // for project
//   await Promise.all(
//     project.teamMember.map(async (projectMember) => {
//       const employee = await this.employeeRepository.find({
//         where: {
//           userId: projectMember.userId,
//         },
//       });
//       if (employee.length > 0) {
//         const eW = await this.employeeWorkRepository.create({
//           projectId: project.id.toString(),
//           userId: employee[0].userId,
//           image: employee[0].image,
//           employeeId: employee[0].id.toString(),
//           fullName: employee[0].fullName,
//           employeeType: employee[0].employmentType,
//           role: employee[0].role.activeRole,
//           status: employee[0].status,
//           numberOfWords: project.numberOfWords.toString(),
//         });
//         this.employeeWorkRepository.save(eW);
//       }
//     }),
//   );
// }
