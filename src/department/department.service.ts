import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getObjectId } from 'src/utilities';
import { DepartmentRepository } from './department.repository';
import { CreateDepartmentDto } from './dto/create-department-dto';
import { EditDivisionDto } from './dto/edit-division-dto';
import { EditUnitDto } from './dto/edit-unit-dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentRepository)
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  //   add department
  async createDepartment(departmentDto: CreateDepartmentDto) {
    if (departmentDto.departmentId === undefined) {
      console.log('heyy');
      const div = [];
      for (let i = 0; i < departmentDto.division.length; i++) {
        div.push({
          divisionId: Math.floor(Math.random() * 1000000).toString(),
          divisionName: departmentDto.division[i].divisionName,
          unitName: departmentDto.division[i].unitName,
        });
      }
      const newDepartment = await this.departmentRepository.create({
        ...departmentDto,

        division: div,
      });
      return this.departmentRepository.save(newDepartment);
    } else {
      // edit department if departmentId is present
      try {
        const objectId = getObjectId(departmentDto.departmentId);
        console.log('objectId', objectId);
        const department = await this.departmentRepository.findOne(objectId);
        if (!department) {
          throw new NotFoundException(`Department not found`);
        } else {
          department.departmentName = departmentDto.departmentName;
          department.division = departmentDto.division;
          return this.departmentRepository.save(department);
        }
      } catch (error) {
        console.log(' Department error', error);
        throw new NotFoundException(`Department not found catched`);
      }
    }
  }

  //   add division in particular department
  async addDivision(editDivision: EditDivisionDto, id: string) {
    try {
      const objectId = getObjectId(id);
      const department = await this.departmentRepository.findOne(objectId);
      console.log('department', department);
      if (!department) {
        throw new NotFoundException('Department not found');
      } else {
        const { division } = department;
        division.push({
          // create random id for divisionId
          divisionId: Math.floor(Math.random() * 1000000).toString(),
          divisionName: editDivision.division[0].divisionName,
          unitName: [editDivision.division[0].unitName[0]],
        });
        return this.departmentRepository.save(department);
      }
    } catch (error) {
      throw new Error('Department not found catched');
    }
  }

  //   add unit in particular department

  async addUnit(editDivision: EditDivisionDto, id: string, divisionId: string) {
    try {
      const objectId = getObjectId(id);
      const department = await this.departmentRepository.findOne(objectId);

      if (!department) {
        throw new NotFoundException('Department not found');
      } else {
        const { division } = department;
        const divisionIndex = division.findIndex(
          (each) => each.divisionId == divisionId,
        );
        division[divisionIndex].unitName.push(
          editDivision.division[0].unitName[0],
        );
        return this.departmentRepository.save(department);
      }
    } catch (error) {
      throw new Error('Department not found catched');
    }
  }

  async editUnit(
    editUnit: EditDivisionDto,
    id: string,
    divisionId: string,
    unitIndex: number,
  ) {
    const objectId = getObjectId(id);
    const department = await this.departmentRepository.findOne(objectId);
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    } else {
      const { division } = department;
      // find division by divisionId
      const divisionIndex = division.findIndex(
        (each) => each.divisionId == divisionId,
      );

      // remove particulate unit from unitName and add new unit from editUnit
      division[divisionIndex].unitName.splice(
        unitIndex,
        1,
        editUnit.division[0].unitName[0],
      );

      return this.departmentRepository.save(department);
    }
  }

  // edit division of particular department
  async editDivision(
    editDivision: EditDivisionDto,
    id: string,
    divisionIndex: number,
  ) {
    const objectId = getObjectId(id);
    const department = await this.departmentRepository.findOne(objectId);
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    } else {
      const { division } = department;
      division[divisionIndex].divisionName =
        editDivision.division[0].divisionName;
      division[divisionIndex].unitName = editDivision.division[0].unitName;

      return this.departmentRepository.save(department);
    }
  }

  async deleteDivision(id: string, divisionId: string) {
    const objectId = getObjectId(id);
    const department = await this.departmentRepository.findOne(objectId);

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    const divisionIndex = department.division.findIndex(
      (each) => each.divisionId == divisionId,
    );
    department.division.splice(divisionIndex, 1);
    return this.departmentRepository.save(department);
  }

  async deleteUnit(id: string, divisionId: string, unitIndex: number) {
    const objectId = getObjectId(id);
    const department = await this.departmentRepository.findOne(objectId);

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    const divisionIndex = department.division.findIndex(
      (each) => each.divisionId == divisionId,
    );
    department.division[divisionIndex].unitName.splice(unitIndex, 1);
    return this.departmentRepository.save(department);
  }

  // get all department
  async getAllDepartment() {
    return this.departmentRepository.find();
  }

  // get particular department by id
  async getDepartmentById(id: string) {
    try {
      const objectId = getObjectId(id);
      const department = await this.departmentRepository.findOne(objectId);
      if (!department) {
        throw new NotFoundException(`Department with id ${id} not found`);
      }
      return department;
    } catch (error) {
      throw new NotFoundException('Department not found catched');
    }
  }

  // delete particular department
  async deleteDepartment(id: string) {
    const objectId = getObjectId(id);
    const department = await this.departmentRepository.findOne(objectId);
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    this.departmentRepository.delete(objectId);
    return {
      message: 'Department deleted successfully',
    };
  }
}

//   delete particular division of department by division name
// async deleteDivision(editDivision: EditDivisionDto, id: string) {
//   try {
//     const objectId = getObjectId(id);
//     const department = await this.departmentRepository.findOne(objectId);
//     if (!department) {
//       throw new NotFoundException('Department not found');
//     } else {
//       const { division } = department;
//       const divisionIndex = division.findIndex(
//         (division) =>
//           division.divisionName === editDivision.division[0].divisionName,
//       );
//       console.log(divisionIndex);
//       if (!divisionIndex) {
//         throw new NotFoundException('Division not found');
//       }
//       division.splice(divisionIndex, 1);
//       return this.departmentRepository.save(department);
//     }
//   } catch (error) {
//     throw new Error('Department not found catched');
//   }
// }

// ======== below working

// edit unit of particular department
// async editUni1(
//   editUnit: EditDivisionDto,
//   id: string,
//   divisionIndex: number,
//   unitIndex: number,
// ) {
//   const objectId = getObjectId(id);
//   const department = await this.departmentRepository.findOne(objectId);
//   if (!department) {
//     throw new NotFoundException(`Department with id ${id} not found`);
//   } else {
//     const { division } = department;

//     // remove particulate unit from unitName and add new unit from editUnit
//     division[divisionIndex].unitName.splice(
//       unitIndex,
//       1,
//       editUnit.division[0].unitName[0],
//     );

//     // division[divisionIndex].unitName.push(editUnit.division[0].unitName[0]);
//     return this.departmentRepository.save(department);
//   }
// }

// async addUnit(
//   editDivision: EditDivisionDto,
//   id: string,
//   divisionIndex: number,
// ) {
//   try {
//     const objectId = getObjectId(id);
//     const department = await this.departmentRepository.findOne(objectId);

//     if (!department) {
//       throw new NotFoundException('Department not found');
//     } else {
//       const { division } = department;
//       division[divisionIndex].unitName.push(
//         editDivision.division[0].unitName[0],
//       );
//       return this.departmentRepository.save(department);
//     }
//   } catch (error) {
//     throw new Error('Department not found catched');
//   }
// }
