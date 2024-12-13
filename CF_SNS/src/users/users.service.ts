import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UsersModel} from "./entity/users.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find()
  }

  async createUser(user: Pick<UsersModel, 'email'|'nickname'|'password'>) {
    // 닉네임 중복
    const existingNickname = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      }
    });

    if (existingNickname) {
      throw new BadRequestException('이미 닉네임이 존재합니다.')
    }
    // 이메일 중복
    const existingEmail = await this.usersRepository.exists({
      where: {
        email: user.email,
      }
    });

    if (existingEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.')
    }

    const userObject = this.usersRepository.create({
      email: user.email,
      password: user.password,
      nickname: user.nickname,
    })

    const newUser = await this.usersRepository.save(user);

    return newUser;
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      }
    });
  }
}
