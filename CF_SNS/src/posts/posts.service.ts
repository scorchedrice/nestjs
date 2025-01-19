import { Injectable, NotFoundException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    // PostsModel을 다루는 레포지토리를 주입하겠다.
  ) {}

  async getAllPosts() {
    // typeORM은 모두 async (물론 안해도 되지만 await 쓰고싶을 수 있으니.)
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  // 오름차순으로 정렬하는 pagination
  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postsRepository.find({
      where: {
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });
    /**
     * Response양식
     * data : Data[],
     * cursor : {
     *   after : 마지막 Data의 id
     * },
     * count : 응답 데이터의 개수
     * next : 다음 요청을 할 때 사용할 URL
     */
    return { data: posts };
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
