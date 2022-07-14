import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const logger = new Logger('AuthGuard');
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.token;
    logger.log(`Token: ${token}`);

    if (token) {
      return true;
    }

    return false;
  }
}
