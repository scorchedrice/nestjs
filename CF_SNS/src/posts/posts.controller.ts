import {Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Request} from '@nestjs/common';
import { PostsService } from './posts.service';
import {AccessTokenGuard} from "../auth/guard/bearer-token.guard";
import {AuthService} from "../auth/auth.service";
import {UsersModel} from "../users/entity/users.entity";
import {User} from "../users/decorator/user.decorator";

@Controller('posts')
export class PostsController {
  // post service의 주입 (nestjs IOC container에서 자동 생성)
  constructor(private readonly postsService: PostsService) {}
  // 1) GET / posts => 모든 post를 가져온다.
  // 2) GET / posts / :id => id에 해당하는 post를 가져온다.
  // 3) POST / posts => post를 생성한다.
  // 4) PUT / posts/:id => id에 해당하는 post를 변경한다.
  // 5) DELETE / posts / :id => id에 해당하는 post를 삭제한다.

  // 1.
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  // 2.
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  // 3.
  // Token을 담아 보낸다 ? 여기서 유저 정보 가져올 수 있음.
  @Post()
  @UseGuards(AccessTokenGuard)
  postPosts(
    // @Request() req : any,
    @User('id') userId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const authorId = userId;
    return this.postsService.createPost(
      authorId, title, content,
    )
  }

  // 4.
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
   return this.postsService.updatePost(
     +id, title, content,
   )
  }

  // 5.
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
