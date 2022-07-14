import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeWorkService } from 'src/employee-work/employee-work.service';
import { NewFolderService } from 'src/new-folder/new-folder.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { OrderRepository } from 'src/orders/order.repository';
import { PayRollService } from 'src/payroll/payroll.service';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
import { getObjectId } from 'src/utilities';
import { CreateProjectClosureDto } from './dto/create-project-closure.dto';
import { ProjectClosureRepository } from './project-closure.repository';

@Injectable()
export class ProjectClosureService {
  constructor(
    @InjectRepository(ProjectClosureRepository)
    private readonly projectClosureRepository: ProjectClosureRepository,
    @InjectRepository(ProjectManagement)
    private projectRepository: ProjectManagement,
    private newFolderService: NewFolderService,
    private payrollService: PayRollService,
    private employeeWorkService: EmployeeWorkService,
    private orderRepository: OrderRepository,
    private reviewOrderRepository: ReviewOrderRepository,
    private notificationsService: NotificationsService,
  ) {}

  async createProjectClosure(createProjectClosureDto: CreateProjectClosureDto) {
    try {
      {
        const { evaluationCertificate, editorCertificate, projectId } =
          createProjectClosureDto;
        const objectId = getObjectId(projectId);

        const project = await this.projectRepository.findOne(objectId);

        const projectClosure = await this.projectClosureRepository.create({
          ...createProjectClosureDto,
          orderId: project.orderId,
          projectId: projectId,
          evaluationCertificate: evaluationCertificate,
          editorCertificate: editorCertificate,
        });

        await project.status.push({
          status: 'Project Closed',
          date: new Date().toISOString(),
        });
        project.payrollStatus = 'Pending';
        this.projectRepository.save(project);
        // let projectStatus = project.status;

        let stat = [
          {
            mainStatus: 'Project Closed',
            subStatus: 'Project Closed',
            description: 'Project Closed',
            date: new Date().toISOString(),
          },
        ];

        const orderObjectId = getObjectId(project.orderId);
        const order = await this.orderRepository.findOne(orderObjectId);
        order.status.push(...stat);

        this.orderRepository.save(order);

        const revOrder = await this.reviewOrderRepository.findOne({
          where: {
            orderId: order.id.toString(),
          },
        });
        revOrder.status.push(...stat);
        this.reviewOrderRepository.save(revOrder);
        this.notificationsService.projectClosedNoticeForPayroll(projectClosure);

        this.projectClosureRepository.save(projectClosure);
        this.newFolderService.addFolderInOrderFromProjectClosure(
          projectClosure,
        );
        this.newFolderService.addFolderInOrderOfProject(projectId);
        this.payrollService.teamSummary(projectClosure);
        this.employeeWorkService.employeeDetails(projectClosure);
      }
    } catch (error) {
      console.log('Project Closed Error', error);
      throw new Error('Something went wrong');
    }
  }

  async findOneProjectClosure(id: string) {
    try {
      const objectId = getObjectId(id);
      const projectClosure = await this.projectClosureRepository.findOne(
        objectId,
      );
      if (!projectClosure) {
        throw new NotFoundException('Project Closure not found');
      }

      return projectClosure;
    } catch {
      throw new Error('Something went wrong');
    }
  }
}
