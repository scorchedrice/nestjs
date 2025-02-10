import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
  Request,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { AuthService } from '../auth/auth.service';
import { UsersModel } from '../users/entity/users.entity';
import { User } from '../users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

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
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // 임의 데이터 생성 POST / posts/random
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
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
    @Body() body: CreatePostDto,
    // @Body('title') title: string,
    // @Body('content') content: string,
  ) {
    const authorId = userId;
    return this.postsService.createPost(authorId, body);
  }

  // 4.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, body);
  }

  // 5.
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
