import {
  ConsoleLogger,
  Injectable,
  Logger,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import { User } from 'src/users/user.entity';
import { getObjectId } from 'src/utilities';
import { CreateTaskDto } from './dto/create-task-dto';
import { EditTaskDto } from './dto/edit-task-dto';
import { TaskRepository } from './task.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { IJoinRequest, ITeamMember } from './interfaces';
import { UserRepository } from 'src/users/user.repository';
import { ProjectManagement } from 'src/projects/project-management.repository';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { FindPeopleDto } from './dto/findPeople-dto';
import { OrderRepository } from 'src/orders/order.repository';
import { ReviewOrderRepository } from 'src/review-orders/review-orders.repository';

@Injectable()
export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: NotificationsService,
    @InjectRepository(ProfileDataRepository)
    private profileDataRepository: ProfileDataRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private projectRepository: ProjectManagement,
    private s3Service: S3UploaderService,
    private orderRepository: OrderRepository,
    private reviewOrderRepository: ReviewOrderRepository,
  ) {}

  async addTeamMember(editTask: EditTaskDto, tId: string, user: User) {
    const objectId = getObjectId(tId);
    const task = await this.taskRepository.findOne(objectId);
    if (!task) {
      throw new NotFoundException('Task not found');
    } else {
      const { teamMember } = editTask;
      // project.teamMember=[...project.teamMember, ...teamMember];
      // project.teamMember = teamMember;
      for (let i = 0; i < teamMember.length; i++) {
        task.teamMember.push({
          ...teamMember[i],
        });
      }
      this.notificationService.invitationNotificationForTeamMembersTask(
        task,
        user,
      );
      return this.taskRepository.save(task);
    }
  }

  async exploreTask(user) {
    let listOfProject = await this.projectRepository.find({
      where: { isOpen: true },
    });
    const listOfProject1 = listOfProject.map((project) =>
      project.id.toString(),
    );

    const exactTask = await this.taskRepository.find({
      where: {
        'status.1': { $exists: false },
        projectId: {
          $in: listOfProject1,
        },
        teamMember: { $not: { $elemMatch: { userId: user.id.toString() } } },
      },
    });

    let allTasks = [];
    const assistanceRequestsTasks = await this.taskRepository.find({
      where: {
        assistanceRequestId: { $eq: '' },
      },
    });
    allTasks = [...allTasks, ...assistanceRequestsTasks];
    return exactTask;
  }

  async acceptthisTask(taskId: string, user: User) {
    try {
      const objectId = getObjectId(taskId);
      const task = await this.taskRepository.findOne(objectId);
      let teamMemberinstance = task.teamMember.find(
        (member) => member.userId == user.id.toString(),
      );
      teamMemberinstance.isJoined = true;
      teamMemberinstance.joinedDate = new Date().toISOString();
      teamMemberinstance.declined = false;

      if (task.status.slice(-1)[0].mainStatus != 'In progress') {
        task.status.push({
          mainStatus: 'In progress',
          subStatus: '',
          date: new Date().toISOString(),
          description: 'Task Accepted',
        });
      }

      if (!task) {
        throw new NotFoundException('Project with given not found');
      } else {
        this.notificationService.taskAcceptedByMember(task, user);
        return this.taskRepository.save(task);
      }
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async rejectthisTask(taskId: string, user: User) {
    try {
      const objectId = getObjectId(taskId);
      const task = await this.taskRepository.findOne(objectId);
      let teamMemberInstance = task.teamMember.find(
        (member) => member.userId == user.id.toString(),
      );
      task.teamMember[0].isJoined = false;
      task.teamMember[0].joinedDate = '';
      task.teamMember[0].declined = true;

      // at position of teamMemberInstance, remove 1 item.
      if (!task) {
        throw new NotFoundException('Project with given not found');
      } else {
        this.notificationService.taskRejectByEditor(task, user);

        return await this.taskRepository.save(task);
      }
    } catch (error) {
      throw new NotFoundException('Some error occured');
    }
  }

  async requestToParticipateForTask(taskId: string, user: User) {
    try {
      const objectId = getObjectId(taskId);
      const task = await this.taskRepository.findOne(objectId);

      const { JoinRequest } = task;
      const profileUserInfo = await this.profileDataRepository.findOne({
        where: { userId: user.id.toString() },
      });

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
        // employer: profileUserInfo
        //   ? profileUserInfo.workExperience
        //     ? profileUserInfo.workExperience[0].employer
        //     : ''
        //   : '',
        imageUrl: user.image ? user.image : '',
        // userId: profileUserInfo.userId,
        // name: profileUserInfo.billingAddress.fullName,
        // role: profileUserInfo.profileData.role.activeRole,
        // position: profileUserInfo.workExperience[0].jobTitle,
        // address: profileUserInfo.billingAddress.address,
        // specialization: profileUserInfo.specialities,
        // employer: profileUserInfo.workExperience[0].employer,
        // imageUrl: user.image,
      };
      // console.log(JoinRequest)
      JoinRequest.push(element);
      this.notificationService.notificationRequestToParticipateForTask(
        task,
        user,
      );
      return this.taskRepository.save(task);
    } catch (err) {
      throw new NotFoundException(
        'Profile -data of the user not created fully.',
      );
    }
  }

  async acceptJoinRequestForTask(taskId: string, userid: string, user: User) {
    try {
      const objectId = getObjectId(taskId);
      const userId = getObjectId(userid);
      const task = await this.taskRepository.findOne(objectId);
      const userinfo = await this.userRepository.findOne(userId);
      const joinRequestInstance = task.JoinRequest.filter(
        (item) => item.userId === userid,
      );
      let newTeamMember: ITeamMember;
      newTeamMember = {
        userId: joinRequestInstance[0].userId,
        name: joinRequestInstance[0].name,
        role: joinRequestInstance[0].role,
        imageUrl: userinfo.image,
        isJoined: true,
        joinedDate: new Date().toISOString(),
        invited: true,
        declined: false,
      };
      if (task.status.slice(-1)[0].mainStatus != 'In progress') {
        task.status.push({
          mainStatus: 'In progress',
          subStatus: '',
          date: new Date().toISOString(),
          description: 'Accept Join Request',
        });
      }
      let memberIDToSend = joinRequestInstance[0].userId;
      let titleToSend = task.title;
      let descriptionType = 'task';
      let person = 'Chief Editor';
      let taskIdtoSend = task.id.toString();
      let action = 'accepted';
      let statusToSend = task.status.slice(-1)[0].mainStatus;
      task.teamMember.push(newTeamMember);
      task.JoinRequest.splice(
        task.JoinRequest.indexOf(joinRequestInstance[0]),
        1,
      );

      this.notificationService.notificationJRequest(
        titleToSend,
        memberIDToSend,
        user,
        descriptionType,
        person,
        { taskId: taskIdtoSend },
        action,
        statusToSend,
      );
      return this.taskRepository.save(task);
      // console.log(projectId)
      // return await userid
    } catch (error) {
      throw new NotFoundException('JoinRequest not found in the task');
    }
  }

  async rejectJoinRequestForTask(taskId: string, userid: string, user: User) {
    try {
      const objectId = getObjectId(taskId);
      const userId = getObjectId(userid);
      const task = await this.taskRepository.findOne(objectId);
      const userinfo = await this.userRepository.findOne(userId);
      let joinRequestInstance = task.JoinRequest.filter(
        (item) => item.userId === userid,
      );
      // console.log(joinRequestInstance)
      let userIdToSend = joinRequestInstance[0].userId;
      let titleToSend = task.title;
      let descriptionType = 'task';
      let person = 'Chief Editor';
      let taskIdToSend = task.id.toString();
      let action = 'rejected';
      let statusToSend = task.status.slice(-1)[0].mainStatus;
      this.notificationService.notificationJRequest(
        titleToSend,
        userIdToSend,
        user,
        descriptionType,
        person,
        { taskId: taskIdToSend },
        action,
        statusToSend,
      );
      task.JoinRequest.splice(
        task.JoinRequest.indexOf(joinRequestInstance[0]),
        1,
      );
      return this.taskRepository.save(task);
    } catch (error) {
      throw new NotFoundException('Project not found');
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const {
      projectId,
      subTasks,
      teamMember,
      section,
      numberOfWords,
      documents,
      assistanceRequestId,
      taskSetting,
    } = createTaskDto;
    console.log(createTaskDto);
    // if (!projectId) throw new NotFoundException('Project Not Found');

    const newTask = await this.taskRepository.create({
      ...createTaskDto,

      createdAt: new Date().toISOString(),
      taskSetting,
      taskCreatedDate: new Date().toISOString(),
      projectId: projectId ? projectId : '',
      assistanceRequestId: assistanceRequestId ? assistanceRequestId : '',
      section: section ? section : '',
      numberOfWords: numberOfWords ? numberOfWords : '',
      taskType: projectId ? 'project type' : 'assistance type',
      comment: [],
      startDate: new Date().toISOString(),
      status: [
        {
          mainStatus: 'new',
          subStatus: '',
          date: new Date().toISOString(),
        },
      ],
      JoinRequest: [],
      deliverableFiles: [],
      documents: documents,
      subTasks: subTasks.map((member) => {
        return {
          ...member,
          id: Math.floor(100000000 + Math.random() * 900000000).toString(),
          userId: member.userId.toString(),
          details: member.details,
          dueDate: member.dueDate,
          completed: false,
        };
      }),
      teamMember: teamMember.map((member) => {
        return {
          ...member,
          userId: member.userId,
          name: member.name,
          imageUrl: member.imageUrl,
          joinedDate: '',
          isJoined: false,
          role: member.role,
          invited: false,
        };
      }),
    });

    this.notificationService.invitationNotificationForEditor(newTask, user);
    this.taskRepository.save(newTask);

    if (createTaskDto.projectId) {
      const objectId = getObjectId(createTaskDto.projectId);
      const project = await this.projectRepository.findOne(objectId);

      project.status.push({
        status: 'Project In Progress',
        date: new Date().toISOString(),
      });
      this.projectRepository.save(project);

      let stat = [
        {
          mainStatus: 'Project In Progress',
          subStatus: 'Project In Progress',
          date: new Date().toISOString(),
          description: 'Project In Progress',
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
    }
  }

  async editTask(editTaskDto: EditTaskDto, id: string) {
    try {
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);

      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else return this.taskRepository.editTask(editTaskDto, id);
    } catch {
      throw new NotFoundException('Task Not Found');
    }
  }

  // async addDocument(editTaskDto: EditTaskDto, id: string) {
  //   try {
  //     const objectId = getObjectId(id);
  //     const task = await this.taskRepository.findOne(objectId);

  //     if (!task) throw new NotFoundException('Task with given Id Not Found');
  //     else {
  //       task.document.push(editTaskDto.document[0]);
  //       return await this.taskRepository.save(task);
  //     }
  //   } catch {
  //     throw new NotFoundException('Task what Not Found');
  //   }
  // }

  async addDeliverable(editTaskDto: EditTaskDto, id: string) {
    try {
      const { deliverableFiles } = editTaskDto;
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);

      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else {
        for (let i = 0; i < deliverableFiles.length; i++) {
          task.deliverableFiles.push(editTaskDto.deliverableFiles[i]);
        }
        this.taskRepository.save(task);
      }
    } catch {
      throw new NotFoundException('Task what Not Found');
    }
  }

  // add Documents
  async addDocument(editTaskDto: EditTaskDto, id: string) {
    try {
      const { documents } = editTaskDto;
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);

      console.log('task', task);

      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else {
        for (let i = 0; i < documents.length; i++) {
          task.documents.push(editTaskDto.documents[i]);
        }
        this.taskRepository.save(task);
      }
    } catch {
      throw new NotFoundException('Task what Not Found');
    }
  }

  async addDeliverableByEditor(
    editTaskDto: EditTaskDto,
    id: string,
    user: User,
  ) {
    try {
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);

      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else {
        const { deliverableFiles } = editTaskDto;
        task.status.push({
          mainStatus: 'In progress',
          subStatus: 'CE review in progress',
          date: new Date().toISOString(),
          description: 'Deliverable added by editor',
        });
        for (let i = 0; i < deliverableFiles.length; i++) {
          task.deliverableFiles.push(editTaskDto.deliverableFiles[i]);
        }
        this.taskRepository.save(task);
        this.notificationService.notificationForChiefEditorDocumentUploadedByEditor(
          task,
          user,
        );
      }
    } catch {
      throw new NotFoundException('Task what Not Found');
    }
  }

  // delete deliverableFiles from task by id
  async deleteDeliverableFiles(id: string, fileId: string) {
    try {
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);
      console.log(task);
      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else {
        const file = task.deliverableFiles.find(
          (item) => item.fileId === fileId.toString(),
        );
        console.log('file >>>>', file);
        if (!file) throw new NotFoundException('File with given Id Not Found');
        else {
          task.deliverableFiles.splice(task.deliverableFiles.indexOf(file), 1);
          let f = file.filePath;
          let link = f.split('/').splice(3).join('/');
          let fileLink = { fileLink: link };
          this.s3Service.deleteFile(fileLink);
          return this.taskRepository.save(task);
        }
      }
    } catch {
      throw new NotFoundException('File what Not Found');
    }
  }

  async deleteDocument(id: string, fileId: string) {
    try {
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);
      console.log(task);
      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else {
        const file = task.documents.find(
          (item) => item.fileId === fileId.toString(),
        );
        console.log('file >>>>', file);
        if (!file) throw new NotFoundException('File with given Id Not Found');
        else {
          task.documents.splice(task.deliverableFiles.indexOf(file), 1);
          let f = file.filePath;
          let link = f.split('/').splice(3).join('/');
          let fileLink = { fileLink: link };
          this.s3Service.deleteFile(fileLink);
          return this.taskRepository.save(task);
        }
      }
    } catch {
      throw new NotFoundException('File what Not Found');
    }
  }

  async reUpload(
    editTaskDto: EditTaskDto,
    fileId: string,
    id: string,
    user: User,
  ) {
    try {
      const { deliverableFiles } = editTaskDto;
      const objectId = getObjectId(id);
      const task = await this.taskRepository.findOne(objectId);
      console.log('task', task);
      if (!task) throw new NotFoundException('Task with given Id Not Found');
      else {
        task.status.push({
          mainStatus: 'In Progress',
          subStatus: 'CE review in progress',
          date: new Date().toISOString(),
          description: 'Deliverable reuploaded by editor',
        });

        let file = await task.deliverableFiles.find(
          (item) => item.fileId === fileId.toString(),
        );
        if (!file) throw new NotFoundException('File Not Found');

        task.deliverableFiles.splice(task.deliverableFiles.indexOf(file), 1);
        let f = file.filePath;
        let link = f.split('/').splice(3).join('/');
        let fileLink = { fileLink: link };
        this.s3Service.deleteFile(fileLink);
        for (let i = 0; i < deliverableFiles.length; i++) {
          task.deliverableFiles.push(editTaskDto.deliverableFiles[i]);
        }
        this.taskRepository.save(task);
        this.notificationService.notificationForChiefEditorDocumentUploadedByEditor(
          task,
          user,
        );
      }
    } catch {
      throw new NotFoundException('File what Not Found');
    }
  }

  async myTasksFromProjectId(projectId: string, user: User) {
    try {
      const role = user.role.activeRole;
      const reviewAccessRoles = ['CE', 'QA', 'CM'];
      const tasks = await this.taskRepository.find({
        where: { projectId: projectId },
      });

      if (!tasks) {
        throw new NotFoundException('Task Not Found Of Given Project');
      } else {
        if (reviewAccessRoles.includes(role)) {
          tasks.map((task) => {
            let status =
              task.status[task.status.length - 1].subStatus.toLowerCase();
            if (role.toLowerCase() + ' review in progress' == status) {
              task.status[task.status.length - 1].mainStatus = 'In Review';
              // return task;
            }
          });
          return tasks;
        } else {
          return tasks;
        }
      }
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  // myTasksFromAssistanceRequestID
  async myTasksFromAssistanceRequestId(
    assistanceRequestId: string,
    user: User,
  ) {
    try {
      const role = user.role.activeRole;
      const reviewAccessRoles = ['CE', 'QA', 'CM'];
      const tasks = await this.taskRepository.find({
        where: { assistanceRequestId: assistanceRequestId },
      });
      if (!tasks) {
        throw new NotFoundException(
          'Task Not Found Of Given Assistance Request',
        );
      } else {
        if (reviewAccessRoles.includes(role)) {
          tasks.map((task) => {
            let status =
              task.status[task.status.length - 1].subStatus.toLowerCase();
            if (role.toLowerCase() + ' review in progress' == status) {
              task.status[task.status.length - 1].mainStatus = 'In Review';
              // return task;
            }
          });
          return tasks;
        } else {
          return tasks;
        }
      }
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  getAllTask() {
    return this.taskRepository.find();
  }

  async getTaskById(id: string) {
    try {
      const objectId = new ObjectID(id);
      const task = await this.taskRepository.findOne(objectId);
      if (!task) {
        throw new NotFoundException('Task With Given Id Not Found');
      } else {
        return task;
      }
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async deleteTask(id: string) {
    try {
      const objectId = new ObjectID(id);
      const task = await this.taskRepository.findOne(objectId);
      if (!task) {
        throw new NotFoundException('Task With Given Id Not Found');
      } else {
        return (
          this.taskRepository.delete(task), `${task.title} Deleted Successfully`
        );
      }
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async createComment(editTaskDto: EditTaskDto, id: string, user: User) {
    try {
      const { comment } = editTaskDto;
      const objectId = new ObjectID(id);
      const task = await this.taskRepository.findOne(objectId);
      if (!task) {
        throw new NotFoundException('Task With Given Id Not Found');
      } else {
        task.status.push({
          mainStatus: 'In progress',
          subStatus: 'Changes Requested',
          date: new Date().toISOString(),
          description: 'Comment added ',
        });
        task.comment.push({
          message: comment[0].message,
          document: comment[0].document,
          userId: user.id.toString(),
          commentBy: user.fullName,
          createdDate: new Date().toISOString(),
          role: user.role.activeRole,
          image: user.image,
          fileId: comment[0].fileId,
        });
        return this.taskRepository.save(task);
      }
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async getDocument(id) {
    try {
      console.log('id doc >>>>>', id);
      let deliverableFiles = [];
      const objectId = new ObjectID(id);
      const task = await this.taskRepository.findOne(objectId);
      console.log('task >>>>>', task);
      if (!task) {
        throw new NotFoundException('Task With Given Id Not Found');
      } else {
        return task.deliverableFiles;
      }
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async tickSubTask(taskId: string, id: string) {
    try {
      const objectId = getObjectId(taskId);

      const task = await this.taskRepository.findOne(objectId);
      const subTaskInstance = task.subTasks.filter((item) => item.id === id);
      console.log(subTaskInstance);
      subTaskInstance[0].completed = true;

      return await this.taskRepository.save(task);
    } catch (error) {
      throw new NotFoundException(' Subtask or task not found');
    }
  }

  async tickTask(taskId: string) {
    try {
      const objectId = getObjectId(taskId);

      const task = await this.taskRepository.findOne(objectId);

      task.status.push({
        mainStatus: 'Completed',
        subStatus: '',
        date: new Date().toISOString(),
        description: 'Tick task',
      });

      return await this.taskRepository.save(task);
    } catch (error) {
      throw new NotFoundException(' Task not found');
    }
  }

  async ceTaskApproval(taskid: string, user: User) {
    try {
      const objectId = getObjectId(taskid);
      const task = await this.taskRepository.findOne(objectId);

      let descriptionType = 'Cheif Editor';
      task.status.push({
        mainStatus: 'In progress',
        subStatus: 'QA review in progress',
        date: new Date().toISOString(),
        description: 'Chief Editor Approved',
      });

      this.taskRepository.save(task);
      this.notificationService.notificationForApproval(
        task,
        user,
        descriptionType,
      );
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }
  async qaTaskApproval(taskid: string, user: User) {
    try {
      const objectId = getObjectId(taskid);
      const task = await this.taskRepository.findOne(objectId);

      let descriptionType = 'Quality Assurer';
      task.status.push({
        mainStatus: 'In progress',
        subStatus: 'CM review in progress',
        date: new Date().toISOString(),
        description: 'Quality Assurer Approved',
      });

      this.taskRepository.save(task);
      this.notificationService.notificationForApproval(
        task,
        user,
        descriptionType,
      );
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async cmTaskApproval(taskid: string, user: User) {
    try {
      const objectId = getObjectId(taskid);
      const task = await this.taskRepository.findOne(objectId);
      task.status.push({
        mainStatus: 'Completed',
        subStatus: '',
        date: new Date().toISOString(),
        description: 'Client manager approved',
      });
      console.log(task);

      this.taskRepository.save(task);
      this.notificationService.cmApproval(task, user);
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  async getMyTasks(user: User) {
    try {
      const task = await this.taskRepository.find({
        where: {
          teamMember: {
            $elemMatch: { userId: user.id.toString() },
          },
          // 'status.1': { $exists: false },
        },
      });

      return task;
    } catch (error) {
      throw new NotFoundException('Task catch not found');
    }
  }

  async invitationFromCMToEditor(taskId: string, id: string, user: User) {
    try {
      const objectId = getObjectId(taskId);
      const task = await this.taskRepository.findOne(objectId);
      const objectId2 = getObjectId(id);
      const editor_user = await this.userRepository.findOne(objectId2);
      let newTeamMember: ITeamMember;
      newTeamMember = {
        userId: editor_user.id.toString(),
        name: editor_user.fullName,
        role: editor_user.role.activeRole,
        imageUrl: editor_user.image,
        isJoined: false,
        joinedDate: '',
        invited: true,
        declined: false,
      };
      task.teamMember.push(newTeamMember);
      this.taskRepository.save(task);
      this.notificationService.invitationFromCMToEditor(
        task,
        editor_user,
        user,
      );
    } catch {
      throw new NotFoundException('Task catch not found');
    }
  }
  async recentTasks(user: User) {
    try {
      const projects = await this.projectRepository.find({
        where: {
          teamMember: {
            $elemMatch: { userId: user.id.toString(), isJoined: true },
          },
        },
      });
      const listOfProject1 = projects.map((project) => project.id.toString());

      const listOfTasks = await this.taskRepository.find({
        where: {
          projectId: {
            $in: listOfProject1,
          },
          // startdate is greter than ten days ago
          startDate: {
            $gt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000),
          },
        },
      });
      return listOfTasks;
    } catch {
      throw new NotFoundException('Some error occured.');
    }
  }

  async getTaskByProject(projectId: string) {
    try {
      const task = await this.taskRepository.find({
        where: { projectId: projectId },
      });
      console.log('task', task);
      return task;
    } catch (error) {
      console.log('Error in task', error);
      throw new NotFoundException('Project not found');
    }
  }

  async inviteToProjectInFindPeople(findDto: FindPeopleDto) {
    try {
      console.log('hh');
      const { task, userId } = findDto;

      const objectId = getObjectId(userId);
      const user = await this.userRepository.findOne(objectId);

      console.log('task', task);
      console.log('task', userId);

      task.map(async (item, i) => {
        const taskObjectId = getObjectId(item);
        const oldTask = await this.taskRepository.findOne(taskObjectId);

        let newTeamMember = [];
        newTeamMember.push({
          userId: user.id.toString(),
          name: user.fullName,
          imageUrl: user.image,
          role: 'ED',
          isJoined: false,
          joinedDate: new Date().toISOString(),
          invited: true,
        });
        oldTask.teamMember.push(...newTeamMember);
        this.taskRepository.save(oldTask);
        this.notificationService.inviteFindPeople(oldTask, newTeamMember);
      });
    } catch (error) {
      console.log('ERRRRRRR', error);
      throw new NotFoundException('Task not found');
    }
  }

  // async getTaskDataForGraphs() {
  //   try {
  //     const pipeline = [
  //       {
  //         $group: {
  //           _id: {
  //             $last: '$status.mainStatus',
  //           },
  //           count: {
  //             $sum: 1,
  //           },
  //         },
  //       },
  //     ];
  //     const task = await this.taskRepository.aggregate(pipeline).toArray();
  //     let label = [];
  //     let value = [];
  //     for (let data of task) {
  //       label.push(data._id);
  //       value.push(data.count);
  //     }
  //     return {
  //       label: label,
  //       value: value,
  //     };
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async taskDataFilter(gte, lte) {
    const pipeline = [
      {
        $match: {
          $and: [
            {
              $expr: {
                $gte: ['$createdAt', gte],
              },
            },
            {
              $expr: {
                $lt: ['$createdAt', lte],
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            $last: '$status.mainStatus',
          },
          count: {
            $sum: 1,
          },
        },
      },
    ];
    const task = await this.taskRepository.aggregate(pipeline).toArray();
    return task;
  }
  async getTaskDataForGraphs(){
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
      const yearData = await this.taskDataFilter(yearGte, yearLte);
      const monthData = await this.taskDataFilter(monthGte, monthLte);
      const weekData = await this.taskDataFilter(weekGte, weekLte);
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
}
