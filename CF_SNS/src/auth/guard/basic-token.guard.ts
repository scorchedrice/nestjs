/**
 * 1) request를 불러오고 header의 authorization 부터 토큰을 가져온다.
 * 2) authService.extractTokenFromHeader을 이용하여 사용할 수 있는 형태의 토큰 추출
 * 3) authService.decodeBasicToken => 이메일과 패스워드 추출
 * 4) 이메일과 비밀번호로 사용자 가져온다.
 * 5) 찾아낸 사용자를 요청 객체(1)에 붙힌다.
 */

import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "../auth.service";

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const { email, password } = this.authService.decodeBasicToken(token);
    const user = await this.authService.authenticateWithEmailAndPassword(
      { email,
      password, }
    )
    req.user = user;
    return true;
  }
}