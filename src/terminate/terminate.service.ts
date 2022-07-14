import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { ResignationRepository } from 'src/resignation-form/resignation.repository';
import { UserRepository } from 'src/users/user.repository';
import { getObjectId } from 'src/utilities';
import { CreateTerminationDto } from './dto/create_termination_dto';
import { EditTerminationDto } from './dto/edit_termination_dto';
import { TerminateRepository } from './terminate.repository';
export class TerminateService {
  constructor(
    @InjectRepository(TerminateRepository)
    private readonly terminateRepository: TerminateRepository,
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    @InjectRepository(ResignationRepository)
    private readonly resignationRepository: ResignationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getAllTermination() {
    return await this.terminateRepository.find();
  }

  async getTerminationById(id: string) {
    const termination = await this.terminateRepository.findOne(id);
    if (!termination) {
      throw new NotFoundException('termination not found');
    }
    return termination;
  }

  async createTermination(
    createTerminationDto: CreateTerminationDto,
    id: string,
  ) {
    // try {
    const termination_instance = await this.terminateRepository.find({
      where: { employeeId: id },
    });
    console.log('termination_instance >>>>>', termination_instance);
    if (termination_instance && termination_instance.length > 0) {
      return 'Temination with this employee id already exists';
    } else {
      let { reasonForTermination, ReconciliationForm, password } =
        createTerminationDto;

      console.log('password >>>>>', password);
      const admin = await this.userRepository.findOne({
        where: {
          'role.activeRole': 'AM',
        },
      });
      console.log('Admin >>>', admin);

      const isValid = await bcrypt.compare(password, admin.password);

      if (!isValid) {
        console.log('password is not valid');
        throw new BadRequestException('Invalid password');
      }

      /////////////////////////////
      const employeeId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(employeeId);
      employee.status = 'Archived';
      this.employeeRepository.save(employee);

      let resignation = await this.resignationRepository.findOne({
        where: { employeeId: id },
      });
      let dateOfSubmissionToPut = '';
      if (!resignation) {
        dateOfSubmissionToPut = new Date().toISOString();
      } else {
        dateOfSubmissionToPut = resignation.dateOfSubmission;
      }

      const terminate = await this.terminateRepository.create({
        ...createTerminationDto,
        dateOfSubmission: dateOfSubmissionToPut,
      });

      return this.terminateRepository.save(terminate);
    }
    //   }catch(error) {
    // }
  }

  async editTermination(editTerminationDto: EditTerminationDto, id: string) {
    try {
      let termination = await this.terminateRepository.findOne(id);
      if (!termination) {
        throw new NotFoundException('termination not found');
      }
      termination = {
        ...termination,
        ...editTerminationDto,
      };
      return await this.terminateRepository.save(termination);
    } catch {
      throw new NotFoundException('termination not found');
    }
  }

  async revertTermination(id: string) {
    try {
      let termination = await this.terminateRepository.findOne(id);
      let employeeID = termination.employeeId;
      const employeeId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(employeeId);
      employee.status = 'Active';
      this.employeeRepository.save(employee);
      return termination;
    } catch {
      throw new NotFoundException('termination not found');
    }
  }

  async deleteTermination(id: string) {
    const termination = await this.terminateRepository.findOne(id);
    if (!termination) {
      throw new NotFoundException('termination not found');
    }
    await this.terminateRepository.remove(termination);
  }
}

// reasonForTermination: reasonForTermination.map((member) => {
//   return {
//     ...member,
//     type: member.description,
//     description: member.description,
//   };
// }),
// ReconciliationForm: ReconciliationForm.map((member) => {
//   return {
//     ...member,
//     lastPayrollDate: member.lastPayrollDate,
//     lastWorkingDate: member.lastWorkingDate,
//     company_property: member.company_property,
//     exitCorrespondence: member.exitCorrespondence,
//     terminationDocumentation: member.terminationDocumentation,
//   };
// }),
