import {Controller, Get, Post, NotFoundException, Param, Body, Put, Delete} from '@nestjs/common';
import { PostsService } from './posts.service';

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
  @Post()
  postPosts(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
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
