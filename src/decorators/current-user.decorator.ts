import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//the data is the argument passed to the decorator
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
