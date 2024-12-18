import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entity/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 토큰을 사용하게 되는 방식
   *
   * 1. 사용자가 로그인/회원가입 진행 시 토큰들을 발급받음.
   * 2. 로그인할 때는 Basic 토큰과 함께 보낸다. Basic토큰은 '이메일:비밀번호'를 base64로 인코딩한 형태
   * 3. 아무나 접근 불가능한 정보 private route 접근 시 access token을 헤더에 넣어 요청
   * 4. 토큰과 요청을 함께 받은 서버는 토큰 검정을 통해 현재 요청을 보낸 사용자를 판단한다.
   * 5. 만료기간이 있기에 만료기간이 지나면 새로 토큰을 발급받아야.
   * 6. 토큰이 만료되면 각각의 토큰을 새로 발급받을 수 있도록
   *
   */

  /**
   * 만드려는 기능
   * 1. register (email 기반)
   * - 이메일 닉네임 password 입력 받는다.
   * - 생성이 완료된 경우 token을 반환하여 바로 로그인 처리
   *
   * 2. 로그인
   * - 이메일과 pw로 사용자 검증
   * - 검증이 완료되면 토큰 반환
   *
   * 3. 토큰 반환 (LoginUser)
   * - 토큰을 반환하는 로직
   *
   * 4. 토큰 생성
   * - 3에서 필요한 access, refreshToken을 sign하는 로직
   *
   * 5. 로그인 검증 과정 (authenticateWithEmailAndPassword)
   * - 사용자가 존재하는지 확인
   * - 비밀번호 일치여부 확인
   * - 통과된 경우 사용자 정보 반환 + 토큰
   */
  // 토큰 추출
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }
    const token = splitToken[1];
    return token;
  }

  // email:password => email, password 리스트로
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰');
    }
    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  // token 검증
  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }
  // 새로운 토큰 발급
  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refresh token으로만 해야합니다.',
      );
    }
    return this.signToken(
      {
        ...decoded,
      },
      isRefreshToken,
    );
  }

  /**
   * Payload에 들어갈 정보
   * 1. 이메일
   * 2. sub => id
   * 3. type (access or refresh)
   */
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      id: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    // 1. 사용자 정보 확인
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // 2. 비밀번호의 비교
    // 앞엔 일반 비밀번호 뒤엔 hash값
    const checkPass = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!checkPass) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ) {
    // bcrypt의 경우 해시화 하고 싶은 패스워드 , round를 변수로 적는다.
    // rounds는 hash에 소요되는 시간을 의미한다.
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });
    return this.loginUser(newUser);
  }
}
