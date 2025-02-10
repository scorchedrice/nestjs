import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from '../common/common.service';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from '../common/const/env-keys.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    // PostsModel을 다루는 레포지토리를 주입하겠다.
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}

  async getAllPosts() {
    // typeORM은 모두 async (물론 안해도 되지만 await 쓰고싶을 수 있으니.)
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      {
        relations: ['author'],
      },
      'posts',
    );
    // if (dto.page) {
    //   return this.pagePaginate(dto);
    // } else {
    //   return this.cursorPaginate(dto);
    // }
  }

  async pagePaginate(dto: PaginatePostDto) {
    /**
     * data: Data[],
     * total : number,
     */
    const [posts, count] = await this.postsRepository.findAndCount({
      // 1번 페이지부터 시작하고, 페이지마다 갯수가 정해져 있음.
      // 특정 페이지는 1번페이지부터 특정 페이지 전 페이지까지의 갯수를 스킵
      skip: dto.take * (dto.page - 1),
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt,
      },
    });
    return {
      data: posts,
      total: count,
    };
  }

  async cursorPaginate(dto: PaginatePostDto) {
    // 네이밍 규칙 => 객체__객체내부_설명 이라고 생각하면 된다.

    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id__less_than) {
      where.id = LessThan(dto.where__id__less_than);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    // 해당되는 post 0개 이상 => 마지막 포스트 가져옴
    // 아니라면 null 반환
    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;
    const nextUrl =
      lastItem &&
      new URL(
        `${this.configService.get(ENV_PROTOCOL_KEY)}://${this.configService.get(ENV_HOST_KEY)}/posts`,
      );
    if (nextUrl) {
      // dto의 키값을 루핑하면서, 키값에 해당하는 밸류가 존재한다면
      // param에 그대로 붙혀 넣는다.
      // 단 id값만 lastItem의 마지막 값을 넣어준다.
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;
      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }
    /**
     * Response양식
     * data : Data[],
     * cursor : {
     *   after : 마지막 Data의 id
     * },
     * count : 응답 데이터의 개수
     * next : 다음 요청을 할 때 사용할 URL
     */
    return {
      data: posts,
      counts: posts.length,
      cursor: {
        // null => null 반환해야하므로.
        after: lastItem?.id ?? null,
      },
      next: nextUrl?.toString() ?? null,
    };
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의 ${i}번째 post`,
        content: `임의 ${i}번째 content`,
      });
    }
  }

  async getPostById(id: number) {
    // id값을 찾아 반환하기.
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    // create => 저장할 객체를 생성한다.
    // save => 객체를 저장한다. (create 매서드에서 생성한 객체로)
    // 이를 조합해서 진행하자!
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(id: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    // save의 기능
    // 1. 데이터가 존재하지 않으면 (id기준으로) => 새로 생성한다.
    // 2. 만약에 데이터가 존재한다면 => 존재하던 값을 업데이트 한다.
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(id);
    return id;
  }
}
