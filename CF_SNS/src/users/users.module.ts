import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModel} from "./entity/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]),
  ],
  // export 해야 다른 모듈에서 사용 가능
  exports: [
    UsersService,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
