import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostsModel} from "./entities/posts.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsModel,
    ])
  ],
  // forRoot : typeORM을 연결 설정할 때
  // forFeature : model에 해당하는 레포지토리를 주입할 때
  controllers: [PostsController],
  providers: [PostsService],
  // 주입되는 것들로 여기에 등록된 것은 instance를 생성하지 않고 사용 가능
})
export class PostsModule {}
