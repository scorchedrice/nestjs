import {createParamDecorator, ExecutionContext, InternalServerErrorException} from "@nestjs/common";
import {UsersModel} from "../entity/users.entity";

export const User = createParamDecorator((data : keyof UsersModel, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const user = req.user as UsersModel;
  if (!user) {
    throw new InternalServerErrorException('User데코레이터는 AccessTokenGuard와 함꼐 사용해야합니다.');
  }
  if (data) {
    return user[data];
  }
  return user;
})