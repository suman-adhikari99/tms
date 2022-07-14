import { Controller, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { TerminateService } from './terminate.service';
import { Get, Body, Post, Put, Delete, Injectable } from '@nestjs/common';
import { CreateTerminationDto } from './dto/create_termination_dto';
import { EditTerminationDto } from './dto/edit_termination_dto';

@Controller('terminate')
export class TerminateController {
  constructor(private terminateService: TerminateService) {}

  @Get()
  getAllTermination() {
    return this.terminateService.getAllTermination();
  }

  @Get('/:id')
  getTerminationById(@Param('id') id: string) {
    return this.terminateService.getTerminationById(id);
  }

  @Post('/:id')
  createTermination(
    @Body() createTerminationDto: CreateTerminationDto,
    @Param('id') id: string,
  ) {
    return this.terminateService.createTermination(createTerminationDto, id);
  }

  @UsePipes(ValidationPipe)
  @Put('/:id')
  editTermination(
    @Body() editTerminationDto: EditTerminationDto,
    @Param('id') id: string,
  ) {
    return this.terminateService.editTermination(editTerminationDto, id);
  }

  @UsePipes(ValidationPipe)
  @Put('/revert/:id')
  revertTermination(@Param('id') id: string) {
    return this.terminateService.revertTermination(id);
  }

  @Delete('/:id')
  deleteTermination(@Param('id') id: string) {
    return this.terminateService.deleteTermination(id);
  }
}
