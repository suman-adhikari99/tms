import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  HttpException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';
import { OrderRepository } from 'src/orders/order.repository';
import { ProfileDataRepository } from 'src/profile-data/profile-data.repository';
import { IJoinRequest, ITeamMember } from 'src/task/interfaces';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId, getString } from 'src/utilities';
import { AssistanceRequestsRepository } from './assistance-requests.repository';
import { SaveAssistanceRequestsDto } from './dto/save-assistance-requests.dto';
import {
  AddFileForAssistanceRequestDto,
  UpdateAssistanceRequestsDto,
} from './dto/update-save-assistanceRequests-dto';
import { TeamMember } from './interfaces';

@Injectable()
export class AssistanceRequestsService {
  constructor(
    @InjectRepository(AssistanceRequestsRepository)
    private assistanceRequestsRepository: AssistanceRequestsRepository,
    private orderRepository: OrderRepository,
    private userRepository: UserRepository,
    private notificationService: NotificationsService,
    @InjectRepository(ProfileDataRepository)
    private profileDataRepository: ProfileDataRepository,
  ) {}

  async cmAssistanceRequestApproval(arId: string, user: User) {
    try {
      const objectId = getObjectId(arId);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);
      assisstanceRequest.status.push({
        mainStatus: 'Assistance Request Accepted',
        subStatus: '',
        date: new Date().toISOString(),
        description: 'Assistance Request Accepted',
      });
      console.log(assisstanceRequest);

      this.assistanceRequestsRepository.save(assisstanceRequest);
      this.notificationService.cmApproval(assisstanceRequest, user);
    } catch (error) {
      throw new NotFoundException('Task Not Found');
    }
  }

  // async saveAssistanceRequest(assistanceRequest) {
  //   const { orderId } = assistanceRequest;
  //   const order = await this.orderRepository.findOne(orderId);
  //   const manager = await this.userRepository.find({
  //     where: {
  //       'role.mainRoles': { $in: ['CM'] },
  //     },
  //   });
  //   let teams = [];
  //   for (let i = 0; i < manager.length; i++) {
  //     teams.push({
  //       name: manager[i].fullName,
  //       userId: manager[i].id.toString(),
  //       role: manager[i].role.activeRole,
  //       isJoined: true,
  //       joinedDate: new Date().toISOString(),
  //       invited: true,
  //       declined: false,
  //       imageUrl: manager[i].image,
  //     });
  //   }
  //   const newAssistanceService = await this.assistanceRequestsRepository.create(
  //     {
  //       ...assistanceRequest,
  //       teamMember: teams,
  //       title: order.journalTitle,
  //       orderId: orderId,
  //       date: new Date().toISOString(),
  //       status: [
  //         {
  //           mainStatus: 'Pending',
  //           subStatus: '',
  //           date: new Date().toISOString(),
  //         },
  //       ],
  //       billingAddress: order.billingAddress,
  //       personalInformation: order.personalInformation,
  //       deliverableFiles: [],
  //       activeDocuments: {},
  //       supportingDocuments: {},
  //     },
  //   );

  //   this.assistanceRequestsRepository.save(newAssistanceService);
  //   this.notificationService.assistanceRequest(
  //     newAssistanceService,
  //     order.reviewedBy,
  //   );
  // }

  async addTeamMember(
    id: string,
    updateAssistance: UpdateAssistanceRequestsDto,
    user: User,
  ) {
    const objectId = getObjectId(id);
    const assistanceRequest = await this.assistanceRequestsRepository.findOne(
      objectId,
    );

    if (!assistanceRequest) {
      throw new NotFoundException(`Assistance Request with id ${id} not found`);
    }

    for (let teamMember of updateAssistance.teamMember) {
      assistanceRequest.teamMember.push(teamMember);
    }

    this.notificationService.invitationNotificationForTeamMembers(
      assistanceRequest,
      user,
    );

    return this.assistanceRequestsRepository.save(assistanceRequest);
  }

  async deleteTeamMember(id: string, index: number) {
    const objectId = getObjectId(id);
    const assistanceRequest = await this.assistanceRequestsRepository.findOne(
      objectId,
    );
    if (!assistanceRequest) {
      throw new NotFoundException(`Assistance Request with id ${id} not found`);
    }

    assistanceRequest.teamMember.splice(index, 1);
    return await this.assistanceRequestsRepository.save(assistanceRequest);
  }

  // async acceptthisAssistanceRequest(arId: string, user: User) {
  //   try {
  //     if (user.role.activeRole !== 'CM') {
  //       throw new BadRequestException('You are not a client manager');
  //     }
  //     const objectId = getObjectId(arId);
  //     const oId = await this.assistanceRequestsRepository.findOne(objectId);
  //     if (!oId) {
  //       throw new NotFoundException('Order not found');
  //     }
  //     const order = await this.assistanceRequestsRepository.find({
  //       where: { 'status.mainStatus': 'Pending' },
  //     });
  //     if (!order) {
  //       throw new NotFoundException('Order Status type not found');
  //     } else {
  //       // (oId.quotationStatus = ''),
  //       oId.status.push({
  //         mainStatus: 'In Progress',
  //         subStatus: '',
  //         date: new Date().toISOString(),
  //         description: 'Assistance Request Accepted',
  //       });

  //       oId.teamMember.push({
  //         name: user.fullName,
  //         userId: user.id.toString(),
  //         role: user.role.activeRole,
  //         isJoined: true,
  //         joinedDate: new Date().toISOString(),
  //         invited: true,
  //         declined: false,
  //         imageUrl: user.image,
  //       });

  //       this.assistanceRequestsRepository.save(oId);
  //       let mId = user.id;

  //       this.notificationService.sendAcceptNotification(oId, mId);
  //     }
  //   } catch (err) {
  //     throw new NotFoundException(err);
  //   }
  // }

  async acceptAssistanceRequest(arId: string, user: User) {
    try {
      const objectId = getObjectId(arId);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);

      if (!assisstanceRequest)
        throw new NotFoundException(
          'Assistance with given id not found not found',
        );

      assisstanceRequest.teamMember.push({
        name: user.fullName,
        userId: user.id.toString(),
        role: user.role.activeRole,
        isJoined: true,
        joinedDate: new Date().toISOString(),
        invited: true,
        declined: false,
        imageUrl: user.image,
      });

      if (user.role.activeRole === 'CM') {
        assisstanceRequest.status.push({
          mainStatus: 'In progress',
          subStatus: '',
          date: new Date().toISOString(),
          description: 'Assistance Request Accepted',
        });
      }

      this.notificationService.taskAcceptedByMember(assisstanceRequest, user);
      return this.assistanceRequestsRepository.save(assisstanceRequest);
    } catch (error) {
      throw new NotFoundException('Assistance Request not found');
    }
  }

  async rejectAssistanceRequest(arId: string, user: User) {
    try {
      const objectId = getObjectId(arId);

      const assissanceRequest = await this.assistanceRequestsRepository.findOne(
        objectId,
      );

      if (!assissanceRequest)
        throw new NotFoundException(
          'Assistance with given id not found not found',
        );

      const userMemberIndex = assissanceRequest.teamMember.findIndex(
        (mem) =>
          mem.userId === getString(user.id) &&
          mem.role === user.role.activeRole
      );

      if (userMemberIndex !== -1) {
        assissanceRequest.teamMember[userMemberIndex].isJoined = false;
        assissanceRequest.teamMember[userMemberIndex].declined = true;
      }

      if (user.role.activeRole === 'CM') {
        assissanceRequest.status.push({
          date: new Date().toISOString(),
          mainStatus: 'Rejected',
          subStatus: '',
          description: 'Assistance Request Rejected',
        });
      }

      await this.assistanceRequestsRepository.save(assissanceRequest);
      this.notificationService.taskRejectByManager(assissanceRequest, user);
    } catch (error) {
      throw new NotFoundException('Some error occured');
    }
  }

  async requestToParticipateForAssistanceRequest(arId: string, user: User) {
    try {
      const objectId = getObjectId(arId);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);

      const { JoinRequest } = assisstanceRequest;
      const profileUserInfo = await this.profileDataRepository.findOne({
        where: { userId: user.id.toString() },
      });

      let element: IJoinRequest;
      element = {
        userId: profileUserInfo.userId,
        name: profileUserInfo.billingAddress.fullName,
        role: profileUserInfo.profileData.role.activeRole,
        position: profileUserInfo.workExperience[0].jobTitle,
        address: profileUserInfo.billingAddress.address,
        specialization: profileUserInfo.specialities,
        employer: profileUserInfo.workExperience[0].employer,
        imageUrl: user.image,
      };
      JoinRequest.push(element);
      this.notificationService.notificationRequestToParticipateForTask(
        assisstanceRequest,
        user,
      );
      return this.assistanceRequestsRepository.save(assisstanceRequest);
    } catch (err) {
      throw new NotFoundException(
        'Profile -data of the user not created fully.',
      );
    }
  }

  async acceptJoinRequestForAssistanceRequest(
    ar: string,
    userId: string,
    user: User,
  ) {
    try {
      const objectId = getObjectId(ar);
      const user = getObjectId(userId);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);
      const userinfo = await this.userRepository.findOne(userId);
      const joinRequestInstance = assisstanceRequest.JoinRequest.filter(
        (item) => item.userId === userId,
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
      if (assisstanceRequest.status.slice(-1)[0].mainStatus != 'In progress') {
        assisstanceRequest.status.push({
          mainStatus: 'In progress',
          subStatus: '',
          date: new Date().toISOString(),
          description: 'Assistance Request Accepted',
        });
      }
      let userIdToSend = joinRequestInstance[0].userId;
      let titleToSend = assisstanceRequest.title;
      let descriptionType = 'Assisstance Request';
      let person = 'Chief Editor';
      let assisstanceRequestToSend = assisstanceRequest.id.toString();
      let action = 'accepted';
      let statusToSend = assisstanceRequest.status.slice(-1)[0].mainStatus;
      assisstanceRequest.teamMember.push(newTeamMember);
      assisstanceRequest.JoinRequest.splice(
        assisstanceRequest.JoinRequest.indexOf(joinRequestInstance[0]),
        1,
      );

      this.notificationService.notificationJRequest(
        titleToSend,
        userIdToSend,
        user,
        descriptionType,
        person,
        { assisstanceRequest: assisstanceRequestToSend },
        action,
        statusToSend,
      );
      return await this.assistanceRequestsRepository.save(assisstanceRequest);
      // console.log(projectId)
      // return await userid
    } catch (error) {
      throw new NotFoundException('JoinRequest not found in the task');
    }
  }

  async rejectJoinRequestForAssistanceRequest(
    arId: string,
    userid: string,
    user: User,
  ) {
    try {
      const objectId = getObjectId(arId);
      const userId = getObjectId(userid);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);
      const userR = await this.userRepository.findOne(userId);
      let joinRequestInstance = assisstanceRequest.JoinRequest.filter(
        (item) => item.userId === userid,
      );
      let userIdToSend = joinRequestInstance[0].userId;
      let titleToSend = assisstanceRequest.title;
      let descriptionType = 'task';
      let person = 'Chief Editor';
      let arIdToSend = assisstanceRequest.id.toString();
      let action = 'rejected';
      let statusToSend = assisstanceRequest.status.slice(-1)[0].mainStatus;
      this.notificationService.notificationJRequest(
        titleToSend,
        userIdToSend,
        user,
        descriptionType,
        person,
        { taskId: arIdToSend },
        action,
        statusToSend,
      );
      assisstanceRequest.JoinRequest.splice(
        assisstanceRequest.JoinRequest.indexOf(joinRequestInstance[0]),
        1,
      );
      return this.assistanceRequestsRepository.save(assisstanceRequest);
    } catch (error) {
      console.log('ARRRRR >>>>', error);
      throw new NotFoundException('Assisstance Request not found');
    }
  }

  async addDeliverable(
    editAssistanceRequest: UpdateAssistanceRequestsDto,
    id: string,
  ) {
    try {
      const { deliverableFiles } = editAssistanceRequest;
      const objectId = getObjectId(id);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);

      if (!assisstanceRequest)
        throw new NotFoundException(
          'Assisstance Request with given Id Not Found',
        );
      else {
        for (let i = 0; i < deliverableFiles.length; i++) {
          assisstanceRequest.deliverableFiles.push(
            editAssistanceRequest.deliverableFiles[i],
          );
        }
        return this.assistanceRequestsRepository.save(assisstanceRequest);
      }
    } catch {
      throw new NotFoundException('Assistance request not Found catched');
    }
  }

  // add activeDocument inside assistance request
  async addActiveDocument(
    editAssistanceRequest: AddFileForAssistanceRequestDto,
    id: string,
  ) {
    try {
      const { activeDocument } = editAssistanceRequest;

      const objectId = getObjectId(id);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);

      if (!assisstanceRequest)
        throw new NotFoundException(
          'Assisstance Request with given Id Not Found',
        );

      if (assisstanceRequest.optionalManuscriptDocument) {
        assisstanceRequest.optionalManuscriptDocument.push(activeDocument);
      } else {
        assisstanceRequest.optionalManuscriptDocument = [activeDocument];
      }

      return this.assistanceRequestsRepository.save(assisstanceRequest);
    } catch (err) {
      console.log('error', err);
      throw new NotFoundException(err);
    }
  }

  async addSupportingDocument(
    editAssistanceRequest: UpdateAssistanceRequestsDto,
    id: string,
  ) {
    try {
      const { supportingDocuments } = editAssistanceRequest;
      const objectId = getObjectId(id);
      const assisstanceRequest =
        await this.assistanceRequestsRepository.findOne(objectId);

      if (!assisstanceRequest)
        throw new NotFoundException(
          'Assisstance Request with given Id Not Found',
        );
      else {
        assisstanceRequest.supportingDocuments = supportingDocuments;
        for (let i = 0; i < supportingDocuments.document.length; i++) {
          assisstanceRequest.supportingDocuments.document.push(
            editAssistanceRequest.supportingDocuments.document[i],
          );
        }
        return this.assistanceRequestsRepository.save(assisstanceRequest);
      }
    } catch {
      throw new NotFoundException('Assistance Not Found catched');
    }
  }

  // get assistance request by id
  async getAssistanceRequestById(id: string) {
    return await this.assistanceRequestsRepository.findOne(id);
  }

  async getAllAssistanceRequests() {
    return await this.assistanceRequestsRepository.find();
  }

  // my assistance request after invitation check by userId
  async getMyAssistanceRequest(user: User) {
    try {
      if (user.role.activeRole === 'CU')
        return this.assistanceRequestsRepository.find({
          where: {
            userId:getString(user.id)
          }
        });

      const assistanceRequest = await this.assistanceRequestsRepository.find({
        where: {
          teamMember: {
            $elemMatch: {
              userId: getString(user.id),
              role: user.role,
            },
          },
        },
      });
      return assistanceRequest;
    } catch {
      throw new NotFoundException('Assistance Request not found');
    }
  }

  async saveAssistanceRequestFinal(
    assistanceRequest: SaveAssistanceRequestsDto,
    user: User,
  ) {
    try {
      // console.log(assistanceRequest);
      const { orderId } = assistanceRequest;

      const order = await this.orderRepository.findOne(orderId);

      const assistance = await this.assistanceRequestsRepository.findOne({
        where: {
          orderId: orderId,
        },
      });

      if (assistance) {
        throw new ConflictException('Order already has an assistance service');
      }

      const manager = await this.userRepository.find({
        where: {
          'role.mainRoles': { $in: ['CM'] },
        },
      });

      let teamMembers = [];

      for (let i = 0; i < manager.length; i++) {
        teamMembers.push({
          userId: manager[i].id.toString(),
        });
      }

      const newAssistanceRequest =
        await this.assistanceRequestsRepository.create({
          ...assistanceRequest,
          orderId: orderId,
          userId: user.id.toString(),
          date: new Date().toISOString(),
          teamMember: [],
          title: order.journalTitle,
          billingAddress: order.billingAddress,
          personalInformation: order.personalInformation,
          deliverableFiles: [],
          activeDocuments: {
            document: [],
            label: '',
          },
          supportingDocuments: {
            document: [],
            label: '',
          },
          status: [
            {
              date: new Date().toISOString(),
              mainStatus: 'Pending',
              subStatus: '',
              description: 'New order arrived. Send for confirmation',
            },
          ],
        });

      this.assistanceRequestsRepository.save(newAssistanceRequest);
      this.notificationService.assistanceRequest(
        newAssistanceRequest,
        teamMembers,
        order.userId,
      );

      return newAssistanceRequest;
    } catch (err) {
      console.log('error', err);
      throw new ForbiddenException(err);
    }
  }

  async cancelRequest(rId: string, user: User) {
    try {
      const objectId = getObjectId(rId);
      const assistanceRequest = await this.assistanceRequestsRepository.findOne(
        objectId,
      );

      if (user.id.toString() !== assistanceRequest.userId) {
        throw new NotFoundException(
          'You are not authorized to cancel this request',
        );
      }
      if (!assistanceRequest)
        throw new NotFoundException(
          'Assistance Request with given Id Not Found',
        );

      assistanceRequest.status.push({
        mainStatus: 'Request Cancelled',
        subStatus: 'Request Cancelled',
        date: new Date().toISOString(),
        description: ` Assistance Request has been Cancelled`,
      });
      this.assistanceRequestsRepository.save(assistanceRequest);
    } catch (err) {
      console.log(err);
      throw new NotFoundException(err);
    }
  }

  async editRequest(
    editRequest: UpdateAssistanceRequestsDto,
    id: string,
    user: User,
  ) {
    // let { password } = editUserDto;
    try {
      let assistanceRequest = this.assistanceRequestsRepository.findOne({ id });
      // const {userId}=order;
      // if(user.id.toString() !== order.userId) throw new ForbiddenException('You are not authorized to edit this order');

      // order = {
      //   ...order,
      //   ...editOrderDto,
      // };

      this.assistanceRequestsRepository.editAssistanceRequest(editRequest, id);
    } catch (err) {
      console.log(err);
      throw new NotFoundException('Order Catch what Not Found');
    }
  }
}
