import {
  Controller,
  Get,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { EditorService } from './editor.service';

@Controller('editor')
export class EditorController {
  constructor(private editorService: EditorService) {}

  @Get('/my')
  getMyProjects(@CurrentUser() user: User) {
    return this.editorService.getMyTasks(user);
  }

  @Get('/recent-projects/')
  getRecentProjects(@CurrentUser() currentUser: User) {
    return this.editorService.getRecentProjects(currentUser);
  }
}
