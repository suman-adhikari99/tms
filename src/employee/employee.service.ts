import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { MailService } from '@sendgrid/mail';
import { MailService } from 'src/mail/mail.service';
import { getObjectId } from 'src/utilities';
import { CreateEmployeeDto } from './dto/create_employee_dto';
import { EditEmployeeDto } from './dto/edit_employee_dto';
import { EmployeeRepository } from './employee.repository';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import axios from 'axios';

const baseDomain = 'https://api.sendgrid.com/v3/marketing/senders';

@Injectable()
export class EmployeeService {
  constructor(
    private mailService: MailService,
    @InjectRepository(EmployeeRepository)
    private readonly employeeRepository: EmployeeRepository,
    private s3Service: S3UploaderService,
  ) {}

  async getAllEmployees() {
    const employees = await this.employeeRepository.find();
    return employees;
  }

  async createEmployee(createEmployeeDto: CreateEmployeeDto, host: string) {
    try {
      const {
        department,
        salaryDetails,
        notes,
        workEmail,
        personalEmail,
        document,
        role,
        fullName,
        employmentType,
        prescribedTime,
      } = createEmployeeDto;

      if (employmentType === 'Inhouse' && prescribedTime === undefined) {
        throw new NotFoundException('Prescribed Time is required');
      }

      const employee = await this.employeeRepository.create({
        ...createEmployeeDto,
        startDate: new Date().toISOString(),
        salaryDetails,
        userId: '',
        image: '',
        role,
        notes: [],
        document: [],
        status: 'Active',
        disciplinaryCase: [],
        prescribedTime,
      });
      const url = `${host}/sign-up`;

      await this.mailService.sendMail({
        to: personalEmail,
        subject: 'Sign Up link',
        html: `<a href="${url}">Sign Up</a>`,
      });

      const dataIn = {
        nickname: fullName,
        from: { email: workEmail, name: fullName },
        reply_to: { email: workEmail, name: fullName },
        address: '1234 Fake St.',
        address_2: '',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'Japan',
      };

      axios({
        method: 'post',
        url: baseDomain,
        data: dataIn,
        headers: {
          Authorization: 'Bearer ' + process.env.SENDGRID_API_KEY,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log('res>>>', res);
        })
        .catch((err) => {
          console.log('err>>>', err);
        });

      return this.employeeRepository.save(employee);
    } catch (err) {
      throw new NotFoundException('Error creating Error');
    }
  }

  async editEmployeeById(id: string, editEmployeeDto: EditEmployeeDto) {
    try {
      const objectId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(objectId);
      let {} = employee;
      if (!employee) {
        return 'Employee not found';
      } else {
        const newEmployee = {
          ...employee,
          ...editEmployeeDto,
        };
        return this.employeeRepository.save(newEmployee);
      }
    } catch (err) {
      throw new NotFoundException('Folder not found catched');
    }
  }
  //   notes ko map garna mileko chaina.

  async deleteEmployee(id: string) {
    try {
      let realId = getObjectId(id);
      let employeeInstance = await this.employeeRepository.findOne(realId);

      this.employeeRepository.delete(employeeInstance);
    } catch (err) {
      throw new NotFoundException('Employee not found');
    }
  }

  async getDisciplinaryCaseByEmployeeId(id: string) {
    try {
      let realId = getObjectId(id);
      let employeeInstance = await this.employeeRepository.findOne(realId);
      return employeeInstance.disciplinaryCase;
    } catch (err) {
      throw new NotFoundException('Employee not found');
    }
  }

  async getCompanyPropertyByEmployeeId(id: string) {
    try {
      let realId = getObjectId(id);
      let employeeInstance = await this.employeeRepository.findOne(realId);
      return employeeInstance.companyProperty;
    } catch (err) {
      throw new NotFoundException('Employee not found');
    }
  }

  async addDocument(editEmployee: EditEmployeeDto, id: string) {
    try {
      const { document } = editEmployee;
      const objectId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(objectId);

      console.log('Employee', employee);

      if (!employee)
        throw new NotFoundException('Employee with given Id Not Found');
      else {
        for (let i = 0; i < document.length; i++) {
          employee.document.push(editEmployee.document[i]);
        }
        this.employeeRepository.save(employee);
      }
    } catch {
      throw new NotFoundException('Employee what Not Found');
    }
  }

  async deleteDocument(id: string, fileId: string) {
    try {
      const objectId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(objectId);
      console.log(employee);
      if (!employee)
        throw new NotFoundException('employee with given Id Not Found');
      else {
        const file = employee.document.find(
          (item) => item.fileId === fileId.toString(),
        );
        console.log('file >>>>', file);
        if (!file) throw new NotFoundException('File with given Id Not Found');
        else {
          employee.document.splice(employee.document.indexOf(file), 1);
          let f = file.filePath;
          let link = f.split('/').splice(3).join('/');
          let fileLink = { fileLink: link };
          this.s3Service.deleteFile(fileLink);
          return this.employeeRepository.save(employee);
        }
      }
    } catch {
      throw new NotFoundException('File what Not Found');
    }
  }

  // add notes
  async addNotes(editEmployee: EditEmployeeDto, id: string) {
    try {
      const { notes } = editEmployee;
      const objectId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(objectId);

      console.log('Employee', employee);

      if (!employee)
        throw new NotFoundException('Employee with given Id Not Found');
      else {
        // for (let i = 0; i < notes.length; i++) {
        //   employee.notes.push(editEmployee.notes[i]);
        // }
        employee.notes.push({
          createdDate: new Date().toISOString(),
          title: notes[0].title,
          description: notes[0].description,
        });

        this.employeeRepository.save(employee);
      }
    } catch {
      throw new NotFoundException('Employee what Not Found');
    }
  }

  async addDisciplinaryCase(editEmployee: EditEmployeeDto, id: string) {
    try {
      const { disciplinaryCase } = editEmployee;
      const objectId = getObjectId(id);
      const employee = await this.employeeRepository.findOne(objectId);

      if (!employee)
        throw new NotFoundException('Employee with given Id Not Found');
      else {
        // for (let i = 0; i < notes.length; i++) {
        //   employee.notes.push(editEmployee.notes[i]);
        // }
        employee.disciplinaryCase.push({
          dateOfSubmission: new Date().toISOString(),
          reasonsForDisciplinaryAction:
            disciplinaryCase[0].reasonsForDisciplinaryAction,
          disciplinaryAction: disciplinaryCase[0].disciplinaryAction,
          detailsOfOccurence: disciplinaryCase[0].detailsOfOccurence,
          dateOfOccurence: disciplinaryCase[0].dateOfOccurence,
          correctiveAction: disciplinaryCase[0].correctiveAction,
          correctiveActionTimeFrame:
            disciplinaryCase[0].correctiveActionTimeFrame,
          followUpDate: disciplinaryCase[0].followUpDate,
          otherReasonsForDisciplinaryAction:
            disciplinaryCase[0].otherReasonsForDisciplinaryAction,
        });

        this.employeeRepository.save(employee);
      }
    } catch {
      throw new NotFoundException('Employee what Not Found');
    }
  }

  async deleteDisciplinaryCase(eId: string, disciplinaryIndex: number) {
    const objectId = getObjectId(eId);
    const employee = await this.employeeRepository.findOne(objectId);
    // const pid = await this.profileDataRepository.findOne({
    //   where: { userId: objectId.toString() },
    // });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${eId} not found`);
    }
    employee.disciplinaryCase.splice(disciplinaryIndex, 1);
    return this.employeeRepository.save(employee);
  }

  // delete notes by index
  async deleteNotes(eId: string, noteIndex: number) {
    const objectId = getObjectId(eId);
    const employee = await this.employeeRepository.findOne(objectId);
    // const pid = await this.profileDataRepository.findOne({
    //   where: { userId: objectId.toString() },
    // });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${eId} not found`);
    }
    employee.notes.splice(noteIndex, 1);
    return this.employeeRepository.save(employee);
  }

  async thisYearsEmployees() {
    let month = [];
    let employees = await this.employeeRepository.find({
      select: ['startDate'],
      order: {
        startDate: 'ASC',
      },
      where: {
        startDate: {
          $gte: new Date(new Date().getFullYear(), 0, 1).toISOString(),
          $lte: new Date(new Date().getFullYear(), 11, 31).toISOString(),
        },
      },
    });
    for (let data of employees) {
      month.push(
        new Date(data.startDate).toLocaleString('default', { month: 'long' }),
      );
    }
    const occurrences = month.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const datas = {
      label: Object.keys(occurrences),
      data: Object.values(occurrences),
    };
    return datas;
  }

  async employeeInThisMonth() {
    const now = new Date();
    let data = await this.employeeRepository.find({
      select: ['startDate'],
      order: {
        startDate: 'ASC',
      },
      where: {
        startDate: {
          $gte: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          $lte: new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
          ).toISOString(),
        },
      },
    });
    let currnetMonth = new Date().toLocaleString('default', { month: 'long' });
    const employeeInMonth = [];
    for (let value of data) {
      if (
        new Date(value.startDate).toLocaleString('default', {
          month: 'long',
        }) == currnetMonth
      ) {
        employeeInMonth.push(
          new Date(value.startDate).toISOString().slice(0, 9),
        );
      }
    }

    const occurrences = employeeInMonth.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const datas = {
      label: Object.keys(occurrences),
      data: Object.values(occurrences),
    };
    return datas;
  }

  async employeeInThisWeek() {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const last = first + 6;
    const employees = await this.employeeRepository.find({
      select: ['startDate'],
      order: {
        startDate: 'ASC',
      },
      where: {
        startDate: {
          $gte: new Date(curr.setDate(first)).toISOString(),
          $lte: new Date(curr.setDate(last)).toISOString(),
        },
      },
    });
    let employeeInThisWeek = [];
    for (let value of employees) {
      employeeInThisWeek.push(
        new Date(value.startDate).toLocaleString('default', {
          weekday: 'long',
        }),
      );
    }

    const occurrences = employeeInThisWeek.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const datas = {
      label: Object.keys(occurrences),
      data: Object.values(occurrences),
    };
    return datas;
  }



  async employeeDateWiseDataForGraph() {
    return {
      year:await this.thisYearsEmployees(),
      month: await this.employeeInThisMonth(),
      week: await this.employeeInThisWeek()
    }
  
  }
}


