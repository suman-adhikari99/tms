import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssistanceRequestsRepository } from 'src/assistance-requests/assistance-requests.repository';
import { NewFolderService } from 'src/new-folder/new-folder.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { getObjectId } from 'src/utilities';
import { CreateRequestClosureDto } from './dto/create-request.dto';
import { RequestClosureRepository } from './request-closure.repository';

@Injectable()
export class RequestClosureService {
  constructor(
    @InjectRepository(RequestClosureRepository)
    private readonly requestClosureRepository: RequestClosureRepository, // private employeeWorkService: EmployeeWorkService,
    private readonly assistanceRequestsRepository: AssistanceRequestsRepository,
    private notificationsService: NotificationsService,
    private newFolderService: NewFolderService,
  ) {}
  async createRequestClosure(createRequestClosureDto: CreateRequestClosureDto) {
    try {
      {
        const {
          evaluationCertificate,
          editorCertificate,
          assistanceRequestId,
        } = createRequestClosureDto;
        const objectId = getObjectId(assistanceRequestId);
        const assistanceRequest =
          await this.assistanceRequestsRepository.findOne(objectId);

        const requestClosure = await this.requestClosureRepository.create({
          ...createRequestClosureDto,
          orderId: assistanceRequest.orderId,
          assistanceRequestId,
          evaluationCertificate: evaluationCertificate,
          editorCertificate: editorCertificate,
        });

        await assistanceRequest.status.push({
          mainStatus: 'Request Closed',
          subStatus: 'Request Closed',
          date: new Date().toISOString(),
          description: 'Request Closed',
        });

        await this.assistanceRequestsRepository.save(assistanceRequest);

        this.notificationsService.projectClosedNoticeForPayroll(requestClosure);
        this.assistanceRequestsRepository.save(assistanceRequest);
        this.newFolderService.addFolderInAssistanceFromRequestClosure(
          requestClosure,
        );
      }
    } catch (error) {
      console.log('Project Closed Error', error);
      throw new Error('Something went wrong');
    }
  }

  async findOneRequestClosure(id: string) {
    try {
      const objectId = getObjectId(id);

      const requestClosure = await this.requestClosureRepository.findOne(
        objectId,
      );
      if (!requestClosure) {
        throw new NotFoundException('Request Closure not found');
      }
      return requestClosure;
    } catch (error) {
      console.log('Request Closure Error', error);
      throw new Error('Something went wrong');
    }
  }
}
