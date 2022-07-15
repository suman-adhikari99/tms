import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddTeamMemberDto } from 'src/team-member/dto/team-member.dto';
import { User } from 'src/users/user.entity';
import { getObjectId, getString } from 'src/utilities';
import { CreateProjectDto } from './dto/create-project-dto';
import { EditProjectDto } from './dto/edit-project-dto';
import { ProjectManagement } from './project-management.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { IJoinRequest, IProjectTeamMember } from './interfaces';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserRepository } from 'src/users/user.repository';
import { Request } from 'express';
import { OrderRepository } from 'src/orders/order.repository';
import { TeamSummaryRepositry } from 'src/team-summary/team-summary.repository';
import { TaskRepository } from 'src/task/task.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';
// import { JoinRequest } from './interfaces';

@Injectable()
export class ProjectManagementService {
  constructor(
    @InjectRepository(ProjectManagement)
    private projectRepository: ProjectManagement,
    @InjectRepository(ProfileDataRepository)
    private profileDataRepository: ProfileDataRepository,
    private notificationService: NotificationsService,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private orderRepository: OrderRepository,
    private teamSummaryRepository: TeamSummaryRepositry,
    private taskRepository: TaskRepository,
    private reviewOrderRepository: ReviewOrderRepository,
  ) {}

  // add only team member inside project
  async addTeamMember(editProject: EditProjectDto, pid: string, user: User) {
    const objectId = getObjectId(pid);
    const project = await this.projectRepository.findOne(objectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    } else {
      const { teamMember } = editProject;
      // project.teamMember=[...project.teamMember, ...teamMember];
      // project.teamMember = teamMember;
      for (let i = 0; i < teamMember.length; i++) {
        project.teamMember.push({
          ...teamMember[i],
        });
      }
      this.notificationService.invitationNotificationForTeamMembers(
        project,
        user,
      );
      return this.projectRepository.save(project);
    }
  }

  async removeMember(pid: string, ind: number) {
    const objectId = getObjectId(pid);
    const project = await this.projectRepository.findOne(objectId);
    if (!project) {
      throw new NotFoundException('Project Not Found');
    } else {
      project.teamMember.splice(ind, 1);
      return await this.projectRepository.save(project);
    }
  }

  async createProject(createProjectDto: CreateProjectDto, user: User) {
    try {
      const {
        teamMember,
        isOpen,
        activeDocuments,
        supportingDocuments,
        orderId,
        specialRequest,
      } = createProjectDto;

      const project = await this.projectRepository.create({
        ...createProjectDto,
        createdDate: new Date().toISOString(),
        payrollStatus: '',
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
          {
            status: 'Enlisting',
            date: new Date().toISOString(),
          },
        ],
        teamMember: teamMember.map((member) => {
          return {
            ...member,
            userId: member.userId,
            name: member.name,
            imageUrl: member.imageUrl,
            role: member.role,
            joinedDate: new Date().toISOString(),
            isJoined: false,
          };
        }),
      });

      let stat = [
        {
          date: new Date().toISOString(),
          mainStatus: 'Project Created',
          subStatus: 'Project Created',
          description: 'New Team Member joined the team.',
        },
        {
          date: new Date().toISOString(),
          mainStatus: 'Enlisting',
          subStatus: 'Enlisting',
          description: 'Project is being Created.',
        },
      ];
      const objectId = getObjectId(orderId);
      const order = await this.orderRepository.findOne(objectId);

      order.status.push(...stat);

      const revOrder = await this.reviewOrderRepository.findOne({
        where: { orderId },
      });

      revOrder.status.push(...stat);

      project.teamMember.push({
        userId: user.id.toString(),
        name: user.fullName,
        imageUrl: user.image,
        role: user.role.activeRole,
        joinedDate: new Date().toISOString(),
        isJoined: true,
      });
      const newProject = await this.projectRepository.save(project);

      this.notificationService.invitationNotificationForTeamMembers(
        newProject,
        user,
      );
      order.projectId = newProject.id.toString();
      this.orderRepository.save(order);

      return project;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async requestToParticipate(projectId: string, user: User) {
    try {
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(objectId);
      console.log(project);
      console.log(user);

      const { JoinRequest } = project;
      const profileUserInfo = await this.profileDataRepository.findOne({
        where: { userId: user.id.toString() },
      });

      console.log(profileUserInfo);

      // let element: IJoinRequest;
      let element;
      element = {
        userId: user.id.toString(),
        name: user.fullName,
        role: user.role.activeRole,
        position: user.positionTitle ? user.positionTitle : '',
        address: user.billingAddress === null ? '' : user.billingAddress,
        specialization: user.specialization === null ? '' : user.specialization,
        employer: 'Edfluent',

        imageUrl: user.image ? user.image : '',
      };
      console.log('element', element);
      JoinRequest.push(element);
      this.notificationService.notificationRequestToParticipate(project, user);
      return this.projectRepository.save(project);
    } catch (err) {
      console.log('Error in request to participate', err);
      throw new NotFoundException(err);
    }
  }

  async editProject(editProjectDto: EditProjectDto, id: string) {
    try {
      const objectId = getObjectId(id);
      const project = await this.projectRepository.findOne(objectId);
      if (!project)
        throw new NotFoundException('Project with given Id Not Found');
      else return this.projectRepository.editProject(editProjectDto, id);
    } catch {
      throw new NotFoundException('Project Not Found');
    }
  }

  getAllProjects() {
    return this.projectRepository.find();
  }

  async getProjectById(id: string, request: Request) {
    try {
      const cookie = request.cookies['token'];
      if (!cookie) throw new UnauthorizedException('No cookie found');
      const objectId = getObjectId(id);
      const project = await this.projectRepository.findOne(objectId);
      if (!project) {
        throw new NotFoundException('Project with given not found');
      } else {
        return project;
      }
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async rejectthisProject(projectId: string, user: User) {
    try {
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(objectId);
      let teamMemberInstance = project.teamMember.find(
        (member) => member.userId == user.id.toString(),
      );
      project.teamMember.splice(
        project.teamMember.indexOf(teamMemberInstance),
        1,
      );
      // at position of teamMemberInstance, remove 1 item.
      if (!project) {
        throw new NotFoundException('Project with given not found');
      } else {
        this.notificationService.rejectedByChiefEditor(project, user);

        return await this.projectRepository.save(project);
      }
    } catch (error) {
      throw new NotFoundException('Some error occured');
    }
  }

  async acceptJoinRequest(projectId: string, userid: string, user: User) {
    try {
      const objectId = getObjectId(projectId);
      const userId = getObjectId(userid);
      const project = await this.projectRepository.findOne(objectId);
      const userinfo = await this.userRepository.findOne(userId);
      const joinRequestInstance = project.JoinRequest.filter(
        (item) => item.userId === userid,
      );
      let newTeamMember: IProjectTeamMember;
      newTeamMember = {
        userId: joinRequestInstance[0].userId,
        name: joinRequestInstance[0].name,
        role: joinRequestInstance[0].role,
        imageUrl: userinfo.image,
        isJoined: true,
        joinedDate: new Date().toISOString(),
      };
      if (project.status.slice(-1)[0].status != 'Project Assigned') {
        project.status.push({
          date: new Date().toISOString(),
          status: 'Project Assigned',
        });
      }
      project.teamMember.push(newTeamMember);

      let userIdToSend = joinRequestInstance[0].userId;
      let titleToSend = project.title;
      let descriptionType = 'project';
      let person = 'Client Manager';
      let action = 'accepted';
      let projectIdToSend = project.id.toString();
      let statusToSend = project.status.slice(-1)[0].status;

      project.JoinRequest.splice(
        project.JoinRequest.indexOf(joinRequestInstance[0]),
        1,
      );

      this.notificationService.notificationJRequest(
        userIdToSend,
        titleToSend,
        user,
        descriptionType,
        person,
        { projectId: projectIdToSend },
        action,
        statusToSend,
      );
      this.projectRepository.save(project);
      let stat = [
        {
          date: new Date().toISOString(),
          mainStatus: 'Project Assigned',
          subStatus: 'Project Assigned',
          description: 'Project is being Assigned.',
        },
      ];
      const order = await this.orderRepository.findOne({
        where: {
          projectId: project.id.toString(),
        },
      });

      order.status.push(...stat);
      this.orderRepository.save(order);

      const revOrder = await this.reviewOrderRepository.findOne({
        where: {
          orderId: order.id.toString(),
        },
      });
      revOrder.status.push(...stat);
      this.reviewOrderRepository.save(revOrder);
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async rejectJoinRequest(projectId: string, userid: string, user: User) {
    try {
      const objectId = getObjectId(projectId);
      const userId = getObjectId(userid);
      const project = await this.projectRepository.findOne(objectId);
      const userinfo = await this.userRepository.findOne(userId);
      let joinRequestInstance = project.JoinRequest.filter(
        (item) => item.userId === userid,
      );
      let userIdToSend = joinRequestInstance[0].userId;
      let titleToSend = project.title;
      let descriptionType = 'project';
      let person = 'Client Manager';
      let action = 'rejected';
      let projectIdToSend = project.id.toString();
      let statusToSend = project.status.slice(-1)[0].status;
      this.notificationService.notificationJRequest(
        titleToSend,
        userIdToSend,
        user,
        descriptionType,
        person,
        { projectId: projectIdToSend },
        action,
        statusToSend,
      );
      project.JoinRequest.splice(
        project.JoinRequest.indexOf(joinRequestInstance[0]),
        1,
      );
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async acceptthisProject(projectId: string, user: User) {
    try {
      const objectId = getObjectId(projectId);
      const project = await this.projectRepository.findOne(objectId);
      let teamMemberinstance = project.teamMember.find(
        (member) => member.userId == user.id.toString(),
      );
      teamMemberinstance.isJoined = true;
      teamMemberinstance.joinedDate = new Date().toISOString();
      if (project.status.slice(-1)[0].status != 'Project Assigned') {
        project.status.push({
          date: new Date().toISOString(),
          status: 'Project Assigned',
        });
      }

      if (!project) {
        throw new NotFoundException('Project with given not found');
      } else {
        this.projectRepository.save(project);
        this.notificationService.acceptedByChiefEditor(project, user);
      }
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async getMyProjects(user: User) {
    try {
      const project = await this.projectRepository.find({
        where: {
          teamMember: {
            $elemMatch: {
              userId: getString(user.id),
              role: user.role.activeRole,
              // isJoined: true
            },
          },
        },
      });

      if (!project) throw new NotFoundException('Project Not found');

      return project;
    } catch (error) {
      throw new NotFoundException('Project catch not found');
    }
  }

  async getProjectByTeamMemberId(id: string, user: User) {
    try {
      if (!user.role.mainRoles.includes('AM'))
        throw new ForbiddenException('You are not Admin');
      const project = await this.projectRepository.find({
        where: { teamMember: { $elemMatch: { userId: id } } },
      });
      if (!project) {
        throw new NotFoundException('Project Not found');
      } else {
        return project;
      }
    } catch (error) {
      return {
        message: 'Project not found',
      };
    }
  }

  // get all project whose isOpen is true
  async getOpenAndNewProjects(user) {
    try {
      const project = await this.projectRepository.find({
        where: {
          isOpen: true,
          teamMember: {
            $not: {
              $elemMatch: { userId: getString(user.id) },
            },
          },
          $and: [
            {
              $expr: { $ne: [{ $last: '$status.status' }, 'Order Confirmed'] },
            },
            {
              $expr: {
                $ne: [{ $last: '$status.status' }, 'New Order Received'],
              },
            },
            {
              $expr: { $ne: [{ $last: '$status.status' }, 'Project Closed'] },
            },
          ],
        },
      });

      if (!project) throw new NotFoundException('Project Not found');

      return project;
    } catch (error) {
      throw new NotFoundException('Project catch not found');
    }
  }

  async addActiveDocument(editProjectDto: EditProjectDto, id: string) {
    try {
      const { activeDocuments } = editProjectDto;
      const objectId = getObjectId(id);
      const project = await this.projectRepository.findOne(objectId);

      if (!project)
        throw new NotFoundException('Project with given Id Not Found');

      for (let i = 0; i < activeDocuments.document.length; i++) {
        project.activeDocuments.document.push(
          editProjectDto.activeDocuments.document[i],
        );
        this.projectRepository.save(project);
      }
    } catch {
      throw new NotFoundException('Project Catch what Not Found');
    }
  }

  async addSupportingDocument(editProjectDto: EditProjectDto, id: string) {
    try {
      const { supportingDocuments } = editProjectDto;
      const objectId = getObjectId(id);
      const project = await this.projectRepository.findOne(objectId);

      if (!project)
        throw new NotFoundException('Project with given Id Not Found');
      else {
        for (let i = 0; i < supportingDocuments.document.length; i++) {
          project.supportingDocuments.document.push(
            editProjectDto.supportingDocuments.document[i],
          );
          this.projectRepository.save(project);
        }
      }
    } catch {
      throw new NotFoundException('Project Catch what Not Found');
    }
  }

  async getJoinRequestForCE(user: User) {
    try {
      const projects = await this.projectRepository.find({
        where: {
          teamMember: {
            $elemMatch: { userId: user.id.toString(), isJoined: true },
          },
        },
      });
      const listOfJoinRequest = projects.map((project) => project.JoinRequest);
      return listOfJoinRequest;
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }

  async getProject(userId: string) {
    try {
      const project = await this.projectRepository.find({
        where: { 'teamMember.userId': userId },
      });
      console.log('Project', project);
      return project;
    } catch (error) {
      console.log('Error in getProject', error);
      throw new NotFoundException('Project not found');
    }
  }

  async getTask(userId: string) {
    try {
      const task = await this.taskRepository.find({
        where: { 'teamMember.userId': userId },
      });
      console.log('task', task);
      return task;
    } catch (error) {
      console.log('Error in task', error);
      throw new NotFoundException('Project not found');
    }
  }

  async projectDataFilter(gte, lte) {
    const pipeline = [
      {
        $match: {
          $and: [
            {
              $expr: {
                $gte: ['$createdDate', gte],
              },
            },
            {
              $expr: {
                $lt: ['$createdDate', lte],
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            $last: '$status.status',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ];
    const projects = await this.projectRepository.aggregate(pipeline).toArray();
    return projects;
  }
  async getProjectDataFOrGraph() {
    try {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay();
      const last = first + 6;
      const yearGte = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const yearLte = new Date(new Date().getFullYear(), 11, 31).toISOString();
      const monthGte = new Date(
        curr.getFullYear(),
        curr.getMonth(),
        1,
      ).toISOString();
      const monthLte = new Date(
        curr.getFullYear(),
        curr.getMonth() + 1,
        0,
      ).toISOString();
      const weekGte = new Date(curr.setDate(first)).toISOString();
      const weekLte = new Date(curr.setDate(last)).toISOString();
      const yearData = await this.projectDataFilter(yearGte, yearLte);
      const monthData = await this.projectDataFilter(monthGte, monthLte);
      const weekData = await this.projectDataFilter(weekGte, weekLte);
      const year = {
        label: [],
        data: [],
      };
      for (let data of yearData) {
        year.data.push(data.count);
        year.label.push(data._id);
      }
      const month = {
        label: [],
        data: [],
      };
      for (let data of monthData) {
        month.data.push(data.count);
        month.label.push(data._id);
      }
      const week = {
        label: [],
        data: [],
      };
      for (let data of weekData) {
        week.data.push(data.count);
        week.label.push(data._id);
      }

      return {
        year: year,
        month: month,
        week: week,
      };
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }

  async projectApprovedDataFilter(gte, lte) {
    console.log('ehekja');
    const pipeline = [
      {
        $match: {
          $and: [
            {
              $expr: {
                $gte: ['$createdDate', gte],
              },
            },
            {
              $expr: {
                $lt: ['$createdDate', lte],
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: '$payrollStatus',

          count: {
            $sum: 1,
          },
        },
      },
    ];
    const projectApproved = await this.projectRepository
      .aggregate(pipeline)
      .toArray();
    console.log(projectApproved);
    return projectApproved;
  }

  async getApprovedProjectDataFOrGraph() {
    try {
      const curr = new Date();
      const first = curr.getDate() - curr.getDay();
      const last = first + 6;
      const yearGte = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const yearLte = new Date(new Date().getFullYear(), 11, 31).toISOString();
      const monthGte = new Date(
        curr.getFullYear(),
        curr.getMonth(),
        1,
      ).toISOString();
      const monthLte = new Date(
        curr.getFullYear(),
        curr.getMonth() + 1,
        0,
      ).toISOString();
      const weekGte = new Date(curr.setDate(first)).toISOString();
      const weekLte = new Date(curr.setDate(last)).toISOString();
      const yearData = await this.projectApprovedDataFilter(yearGte, yearLte);
      const monthData = await this.projectApprovedDataFilter(
        monthGte,
        monthLte,
      );
      const weekData = await this.projectApprovedDataFilter(weekGte, weekLte);
      const year = {
        label: [],
        data: [],
      };
      console.log(yearData);
      // return yearData

      for (let data of yearData) {
        if (data._id == 'Processed') {
          year.data.push(data.count);
          year.label.push(data._id);
        }
      }
      const month = {
        label: [],
        data: [],
      };
      for (let data of monthData) {
        if (data._id === 'Processed') {
          month.data.push(data.count);
          month.label.push(data._id);
        }
      }
      const week = {
        label: [],
        data: [],
      };
      for (let data of weekData) {
        if (data._id === 'Processed') {
          week.data.push(data.count);
          week.label.push(data._id);
        }
      }

      return {
        year: year,
        month: month,
        week: week,
      };
    } catch {
      throw new NotFoundException('Some error occured');
    }
  }
}
