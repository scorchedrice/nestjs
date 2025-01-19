import {Headers, Body, Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {MaxLengthPipe, MinLengthPipe, PasswordPipe} from "./pipe/password.pipe";
import {BasicTokenGuard} from "./guard/basic-token.guard";
import {RefreshTokenGuard} from "./guard/bearer-token.guard";
import {RegisterUserDto} from "./dto/register-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(
    @Headers('authorization') rawToken: string,) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    /**
     * 반환 => accessToken : {token}
     */
    const newToken = this.authService.rotateToken(token, false)

    return {
      accessToken : newToken,
    }
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Headers('authorization') rawToken: string,) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    /**
     * 반환 => accessToken : {token}
     */
    const newToken = this.authService.rotateToken(token, true)

    return {
      refreshToken : newToken,
    }
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(
    @Headers('authorization') rawToken: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body() body: RegisterUserDto,
    // @Body('email') email: string,
    // @Body('password', new MaxLengthPipe(8), new MinLengthPipe(3)) password: string,
    // @Body('nickname') nickname: string,
  ) {
    return this.authService.registerWithEmail(body)
  }
}
