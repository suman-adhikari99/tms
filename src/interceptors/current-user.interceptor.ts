import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

const logger = new Logger('Current User Interceptor');
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    logger.log('ran');
    try {
      const request = context.switchToHttp().getRequest();
      const { token } = request.cookies;

      if (token) {
        const data = await this.jwtService.verifyAsync(token);
        if (data) {
          const user = await this.userService.findOne(data.id);
          request.currentUser = user;
          logger.log(`User ${user.email}'s data is being accessed`);
        }
      }
    } catch (error) {
      logger.error(error);
    }
    return handler.handle();
  }
}
