import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';
import { NotificationsService } from 'src/notifications/notifications.service';
import { getObjectId } from 'src/utilities';
import { MongoEntityManager } from 'typeorm';
import { CreateResignationDto } from './dto/resignation_dto';
// import { CreateEmployeeDto } from './dto/create_employee_dto';
// import { EditEmployeeDto } from './dto/edit_employee_dto';
import { ResignationRepository } from './resignation.repository';

@Injectable()
export class ResignationService {
  constructor(
    @InjectRepository(ResignationRepository)
    private readonly resignationRepository: ResignationRepository,
    private notificationService: NotificationsService,
  ) {}

  async getAllResignations() {
    const resignations = await this.resignationRepository.find();
    return resignations;
  }

  // async getDateOfSubmissionByEid(id: string) {
  //   try {
  //     const resignation = await this.resignationRepository.findOne({
  //       where: { employee_id: id },
  //     });
  //     const dateOfSubmission = resignation.dateOfSubmission;
  //     return dateOfSubmission;
  //   } catch (err) {
  //     throw new NotFoundException(
  //       'Resignation not found of the given employee id',
  //     );
  //   }
  // }

  async createResignation(
    createResignationDto: CreateResignationDto,
  ) {

    const { employee_id } = createResignationDto;

    const prev_resignation = await this.resignationRepository.findOne({
      where: {
        employee_id: employee_id
      }
    });

    if (prev_resignation)
      return new BadRequestException('Employee has already resigned');

    const resignation = await this.resignationRepository.create({
      ...createResignationDto,
    });

    this.resignationRepository.save(resignation);
    this.notificationService.resignationNoticeForAdmin(resignation);
  }
}
