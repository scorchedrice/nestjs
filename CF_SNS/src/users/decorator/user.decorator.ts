import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from '../entity/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;
    // 서버에러를 던지는 이유 : Guard가 실행된 것을 전제로 진행하기에 클라이언트 측의 오류가 아닌 서버측의 오류라고 반환
    if (!user) {
      throw new InternalServerErrorException(
        'User데코레이터는 AccessTokenGuard와 함께 사용해야합니다.',
      );
    }

    // UserModel의 key값들이 data로 오니까, Decorator에 넣는 값에 따라 다른 값들을 반환
    if (data) {
      return user[data];
    }
    return user;
  },
);
