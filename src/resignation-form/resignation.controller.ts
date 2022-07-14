import { Controller, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Body, Post, Put, Delete, Injectable } from '@nestjs/common';
import { CreateResignationDto } from './dto/resignation_dto';

import { ResignationRepository } from './resignation.repository';
import { ResignationService } from './resignation.service';

@Controller('resignation')
export class ResignationController {
  constructor(private resignationService: ResignationService) {}

  // @Get('/dateOfSubmission/:id')
  // getDateOfSubmissionByEid(@Param('id') id: string) {
  //   return this.resignationService.getDateOfSubmissionByEid(id);
  // }
  @Get()
  getAllEResignations() {
    return this.resignationService.getAllResignations();
  }

  @Post('/submit/')
  createResignation(
    @Body() createResignationDto: CreateResignationDto
  ) {
    return this.resignationService.createResignation(createResignationDto);
  }
}
