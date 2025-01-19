import {Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // postUser(@Body('nickname') nickname: string,
  //          @Body('email') email: string,
  //          @Body('password') password: string,) {
  //             return this.usersService.createUser({nickname, email, password});
  //          }
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
