import { Injectable } from '@nestjs/common';
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

  async createUser(nickname: string, email: string, password: string) {
    const user = this.usersRepository.create({
      nickname,
      email,
      password,
    });

    const newUser = await this.usersRepository.save(user);

    return newUser;
  }
}
