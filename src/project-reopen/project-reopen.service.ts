import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from 'src/orders/order.repository';
import { CreateProjectDto } from 'src/projects/dto/create-project-dto';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { User } from 'src/users/user.entity';
import { getObjectId } from 'src/utilities';
import { ProjectReopenDto } from './dto/create-project-reopen.dto';
import { ProjectReopenRepository } from './project-reopen.repository';

@Injectable()
export class ProjectReopenService {
  constructor(
    @InjectRepository(ProjectReopenRepository)
    private projectReopenRepository: ProjectReopenRepository,
    private projectRepository: ProjectManagement,
    private orderRepository: OrderRepository,
  ) {}

  async createProject(projectReopenDto: ProjectReopenDto, user: User) {
    try {
      const { teamMember, activeDocuments, supportingDocuments, projectId } =
        projectReopenDto;

      const objectId = getObjectId(projectId);
      const oldProject = await this.projectRepository.findOne(objectId);
      const teams = oldProject.teamMember;

      const project = await this.projectReopenRepository.create({
        ...projectReopenDto,
        projectId,
        createdDate: new Date().toISOString(),
        teamSummary: [],
        JoinRequest: [],
        createdBy: user.id.toString(),

        activeDocuments: {
          label: 'Active Documents',
          document: activeDocuments.document,
        },
        supportingDocuments: {
          label: 'Active Documents',
          document: supportingDocuments.document,
        },
        isOpen: true,
        status: [
          {
            status: 'New Order Received',
            date: new Date().toISOString(),
          },
          {
            status: 'Order Confirmed',
            date: new Date().toISOString(),
          },
          {
            status: 'Project Created',
            date: new Date().toISOString(),
          },
        ],
        teamMember: teams,
      });

      this.projectReopenRepository.save(project);
      oldProject.status.push({
        status: 'Project Reopened',
        date: new Date().toISOString(),
      });
      this.projectRepository.save(oldProject);
    } catch (err) {
      console.log('Reopen Project error: ', err);
      throw new UnauthorizedException(err);
    }
  }

  async projectReOpen1(projectId: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('CM'))
        throw new ForbiddenException('You are not Client Manager');
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(objectId);

      project.status.push({
        status: 'Project Reopened',
        date: new Date().toISOString(),
      });
      project.reOpen = true;
      const orderObjectId = getObjectId(project.orderId);
      const order = await this.orderRepository.findOne(orderObjectId);
      order.status.push({
        mainStatus: 'Order Delivered',
        subStatus: 'Order Delivered',
        date: new Date().toISOString(),
        description: 'Your order has been Delivered',
      });

      this.projectRepository.save(project);
      this.orderRepository.save(order);
    } catch (err) {
      console.log('err >>', err);
      throw new NotFoundException(err);
    }
  }

  async getReopenedProject(projectId: string) {
    try {
      const project = await this.projectReopenRepository.find({
        where: { projectId },
      });
      console.log('Project', project);
      return Object.values(project)[0];
    } catch (error) {
      console.log('Error in getProject', error);
      throw new NotFoundException('Project not found');
    }
  }
}
