import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { User } from 'src/users/user.entity';
import { getString } from 'src/utilities';
import { AvailabilityRepository } from './availability.repository';
import { CreateAvailabilityDto } from './dto/create-availability';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilityRepository)
    private availabilityRepository: AvailabilityRepository,
    @InjectRepository(EmployeeRepository)
    private employeeRepository: EmployeeRepository,
  ) {}

  async setUserAvailability(
    availability: CreateAvailabilityDto,
    currentUser: User,
  ) {
    const userId = getString(currentUser.id);

    const existingAvailability = await this.availabilityRepository.findOne({
      where: {
        userId: userId
      }
    })

    if (existingAvailability) {
      existingAvailability.availableDays = availability.availableDays;
      return this.availabilityRepository.save(existingAvailability);
    }

    const employeeId = await this.employeeRepository.findOne({
      select: ['id'],
      where: {
        userId: userId,
      },
    });

    const newAvailability = this.availabilityRepository.create({
      ...availability,
      userId: userId,
      employeeId: getString(employeeId.id),
    });

    return this.availabilityRepository.save(newAvailability);
  }

  async getUserAvailability(userId: string) {
    const userAvailability = await this.availabilityRepository.findOne({
      where: {
        userId: userId
      }
    });

    return userAvailability;
  }
}
