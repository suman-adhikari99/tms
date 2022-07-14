import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CreateUserDto } from './dto/create-user-dto';
import { EditUserDto } from './dto/edit-user-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user-dto';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from './dto/change-password-dto';
import { SearchOrderDto } from 'src/orders/dto/search-order.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { request } from 'http';
import { ReviewOrdersService } from 'src/review-orders/review-orders.service';
import { RateUser } from './dto/rate-user.dto';

const logger = new Logger('Users Controller');
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private reviewOrdersService: ReviewOrdersService,
  ) {}

  @Post('/email-test')
  @UseInterceptors(FileInterceptor('file'))
  emainTest(@UploadedFile() file, @Req() request: Request, @Body() body: any) {
    console.log('request>>>', request.headers);
    console.log('body >>>>>>>>>>>>>>>>>>>> ', body);
    console.log('body >>>>>>>>>>>>>>>>>>>> ', JSON.stringify(body));
  }

  @Get('/editors')
  @UseGuards(AuthGuard)
  findEditors() {
    return this.usersService.findEditors();
  }

  @Get('/getRole/:email')
  getRoleByAdmin(@Param('email') email: string) {
    return this.authService.getRoleByAdmin(email);
  }

  @Get('/editor')
  getEditor() {
    return this.usersService.getEditor();
  }

  @Get('/editor/:id')
  getEditorById(@Param('id') id: string) {
    return this.usersService.getEditorById(id);
  }

  @Get('/editor/review/:id')
  getEditorReviewById(@Param('id') id: string) {
    return this.usersService.getEditorReviewById(id);
  }

  @Put('/viewAsED')
  viewAsED(@CurrentUser() user: User) {
    return this.usersService.viewAsED(user);
  }
  @Put('/viewAsQA')
  viewAsQA(@CurrentUser() user: User) {
    return this.usersService.viewAsQA(user);
  }
  @Put('/viewAsCM')
  viewAsCM(@CurrentUser() user: User) {
    return this.usersService.viewAsCM(user);
  }

  @Put('/viewAsCE')
  viewAsCE(@CurrentUser() user: User) {
    return this.usersService.viewAsCE(user);
  }

  @Put('/change-password/:id')
  @UseGuards(AuthGuard)
  changePassword(
    @Body() changePassword: ChangePasswordDto,
    @Param('id') id: string,
  ) {
    return this.usersService.changePassword(changePassword, id);
  }

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;

    return this.authService.signUp(email, password, role);
  }

  @Post('/signin')
  signIn(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    logger.log(`User ${loginUserDto.email} is trying to login`);
    const { email, password, rememberMe } = loginUserDto;
    return this.authService.login(email, password, rememberMe, response);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user?: User) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    // return user;
    return this.usersService.me(user);
  }

  @Get('/client-manager')
  @UseGuards(AuthGuard)
  clientManger(
    @Query() searchOrderDto: SearchOrderDto,
    @CurrentUser() user?: User,
  ) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    return this.usersService.clientManager(searchOrderDto);
  }

  @Get('/client-users')
  @UseGuards(AuthGuard)
  getAllClientUsers() {
    return this.usersService.getAllClientUsers();
  }

  @Put('/client-manager/accept/:id')
  @UseGuards(AuthGuard)
  accept(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    return this.reviewOrdersService.acceptOrder(id, user);
    // return this.usersService.acceptOrder(id, user);
  }

  @Put('/client-manager/reject/:id')
  @UseGuards(AuthGuard)
  reject(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    return this.usersService.rejectOrder(id, user);
  }

  @Put('/client-manager/assistance-request/accept/:id')
  @UseGuards(AuthGuard)
  acceptAr(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    return this.usersService.acceptAssistantRequest(id, user);
  }

  @Put('/client-manager/assistance-request/reject/:id')
  @UseGuards(AuthGuard)
  rejectAr(@Param('id') id: string, @CurrentUser() user: User) {
    if (!user) throw new UnauthorizedException('You are not authorized');
    return this.usersService.rejectAssistantRequest(id, user);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  userLogout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: User,
  ) {
    return this.authService.logout(response, user);
  }

  @Get('/request-reset-password')
  async requestResetPassword(
    @Query('email') email: string,
    @Req() req: Request,
  ) {
    if (typeof email !== 'string') {
      throw new Error('Email is not defined in query');
    }
    return this.usersService.requestResetPassword(email, req.headers.origin);
  }

  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(resetPasswordDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  editUser(@Body() editUserDto: EditUserDto, @Param('id') id: string) {
    return this.usersService.editUser(editUserDto, id);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('/rate')
  rateUser(@Body() feedback: RateUser, @CurrentUser() currentUser: User) {
    return this.usersService.rateUser(feedback, currentUser);
  }
}
