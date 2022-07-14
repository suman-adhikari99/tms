import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddFolderDto } from './dto/add-folder.dto';
import { DeleteFileDto } from './dto/deleteFileDto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { NewFolderService } from './new-folder.service';

@Controller('new-folder')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class NewFolderController {
  constructor(private readonly newFolderService: NewFolderService) {}

  @Post('/project')
  addFolderInProject(@Body() addFolder: AddFolderDto) {
    return this.newFolderService.addFolderInProject(addFolder);
  }

  @Post('/order')
  addFolderInOrder(@Body() addFolder: AddFolderDto) {
    return this.newFolderService.addFolderInOrder(addFolder);
  }

  @Post('/assistance')
  addFolderInAssistance(@Body() addFolder: AddFolderDto) {
    return this.newFolderService.addFolderInAssistance(addFolder);
  }

  @Delete('/:id')
  deleteFolderById(@Param('id') id: string) {
    return this.newFolderService.deleteFolderById(id);
  }

  @Put('/:id')
  updateFolderById(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ) {
    return this.newFolderService.updateFolderById(id, updateFolderDto);
  }

  @Patch('/deleteJustUploaded')
  removeManuscriptFromFolderJustUploaded(@Body() deleteFile: DeleteFileDto) {
    console.log('filePathddd');
    return this.newFolderService.removeManuscriptFromFolderJustUploaded(
      deleteFile,
    );
  }

  @Put('/delete/:id/:fileId')
  deleteManuscript(@Param('id') id: string, @Param('fileId') fileId: string) {
    return this.newFolderService.removeManuscriptFromFolder(id, fileId);
  }

  @Get()
  getAllFolders() {
    return this.newFolderService.getFolders();
  }

  @Get('/project/:id')
  getFoldersOfAProject(@Param('id') id: string) {
    return this.newFolderService.getFoldersOfAProject(id);
  }

  @Get('/order/:id')
  getFoldersOfAnOrder(@Param('id') id: string) {
    return this.newFolderService.getFoldersOfAnOrder(id);
  }

  @Get('/assistance/:id')
  getFoldersOfAnAssistance(@Param('id') id: string) {
    return this.newFolderService.getFoldersOfAnAssistance(id);
  }

  @Get('/:id')
  getFolderById(@Param('id') id: string) {
    return this.newFolderService.getFolderById(id);
  }

  @Get('/invoice/:id')
  getInvoiceByOrderId(@Param('id') id: string) {
    return this.newFolderService.getInvoiceByOrderId(id);
  }
}
