import { Controller, Param, Req } from '@nestjs/common';
import { Get, Body, Post, Put, Delete, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create_employee_dto';
import { EditEmployeeDto } from './dto/edit_employee_dto';
import { EmployeeRepository } from './employee.repository';
import { EmployeeService } from './employee.service';
import { Request } from 'express';
@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Put('/document/:id')
  addDocuments(@Body() employeeDto: EditEmployeeDto, @Param('id') id: string) {
    return this.employeeService.addDocument(employeeDto, id);
  }

  @Put('/deleteFile/:id/:fileId')
  deleteFile(@Param('id') id: string, @Param('fileId') fileId: string) {
    return this.employeeService.deleteDocument(id, fileId);
  }

  @Get('/companyProperty/:id')
  getCompanyPropertyByEmployeeId(@Param('id') id: string) {
    return this.employeeService.getCompanyPropertyByEmployeeId(id);
  }

  @Get('/disciplinaryCase/:id')
  getDisciplinaryCaseByEmployeeId(@Param('id') id: string) {
    return this.employeeService.getDisciplinaryCaseByEmployeeId(id);
  }

  @Get()
  getAllEmployees() {
    return this.employeeService.getAllEmployees();
  }

  @Post()
  createEmployee(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Req() req: Request,
  ) {
    return this.employeeService.createEmployee(
      createEmployeeDto,
      req.headers.origin,
    );
  }

  @Put('/:id')
  editEmployee(
    @Param('id') id: string,
    @Body() editEmployeeDto: EditEmployeeDto,
  ) {
    return this.employeeService.editEmployeeById(id, editEmployeeDto);
  }

  @Delete('/:id')
  deleteEmployee(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }

  @Put('/addNotes/:id')
  addTeamMember(
    @Body() editEmployee: EditEmployeeDto,
    @Param('id') id: string,
    // @CurrentUser() user: User,
  ) {
    return this.employeeService.addNotes(editEmployee, id);
  }

  @Put('/deleteNote/:eId/:noteIndex')
  deleteNote(
    @Param('eId') eId: string,
    @Param('noteIndex') noteIndex: number,
    // @CurrentUser() user: User,
  ) {
    return this.employeeService.deleteNotes(eId, noteIndex);
  }

  @Put('/addDisciplinaryCase/:id')
  disciplinaryCase(
    @Body() editEmployee: EditEmployeeDto,
    @Param('id') id: string,
  ) {
    return this.employeeService.addDisciplinaryCase(editEmployee, id);
  }

  @Put('/deleteDisciplinary/:eId/:disciplinaryIndex')
  deleteDisciplinaryCase(
    @Param('eId') eId: string,
    @Param('disciplinaryIndex') disciplinaryIndex: number,
    // @CurrentUser() user: User,
  ) {
    return this.employeeService.deleteNotes(eId, disciplinaryIndex);
  }

}
