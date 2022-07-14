import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRequestClosureDto } from './dto/create-request.dto';
import { RequestClosureService } from './request-closure.service';

@Controller('request-closure')
export class RequestClosureController {
  constructor(private readonly requestClosureService: RequestClosureService) {}
  @Post()
  create(@Body() createRequestClosureDto: CreateRequestClosureDto) {
    return this.requestClosureService.createRequestClosure(
      createRequestClosureDto,
    );
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.requestClosureService.findOneRequestClosure(id);
  }
}
