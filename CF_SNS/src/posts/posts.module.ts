import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  // 주입되는 것들로 여기에 등록된 것은 instance를 생성하지 않고 사용 가능
})
export class PostsModule {}
