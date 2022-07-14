import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department-dto';
import { EditDivisionDto } from './dto/edit-division-dto';

@Controller('department')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  createDepartment(@Body() departmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(departmentDto);
  }

  @Put('/division/:id')
  addDivision(@Body() editDivision: EditDivisionDto, @Param('id') id: string) {
    return this.departmentService.addDivision(editDivision, id);
  }

  @Put('/unit/:id/:divisionId')
  addUnit(
    @Body() editUnit: EditDivisionDto,
    @Param('id') id: string,
    @Param('divisionId') divisionId: string,
  ) {
    return this.departmentService.addUnit(editUnit, id, divisionId);
  }

  @Delete('/division/:id/:divisionId')
  deleteDivision(
    @Param('id') id: string,
    @Param('divisionId') divisionId: string,
  ) {
    return this.departmentService.deleteDivision(id, divisionId);
  }

  @Delete('/unit/:id/:divisionId/:unitIndex')
  deleteUnit(
    @Param('id') id: string,
    @Param('divisionId') divisionId: string,
    @Param('unitIndex') unitIndex: number,
  ) {
    return this.departmentService.deleteUnit(id, divisionId, unitIndex);
  }

  @Delete('/:id')
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }

  @Get('/:id')
  async getDepartment(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @Get()
  async getAllDepartments() {
    return this.departmentService.getAllDepartment();
  }

  @Put('/edit-division/:id/:divisionIndex')
  editDivision(
    @Body() editUnit: EditDivisionDto,
    @Param('id') id: string,
    @Param('divisionIndex') divisionIndex: number,
  ) {
    return this.departmentService.editDivision(editUnit, id, divisionIndex);
  }

  @Put('/edit-unit/:id/:divisionId/:unitIndex')
  editUnit(
    @Body() editUnit: EditDivisionDto,
    @Param('id') id: string,
    @Param('divisionId') divisionId: string,
    @Param('unitIndex') unitIndex: number,
  ) {
    return this.departmentService.editUnit(editUnit, id, divisionId, unitIndex);
  }
}
