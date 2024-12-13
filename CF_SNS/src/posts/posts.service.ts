import {Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {PostsModel} from "./entities/posts.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>
    // PostsModel을 다루는 레포지토리를 주입하겠다.
  ){}

  async getAllPosts() {
    // typeORM은 모두 async (물론 안해도 되지만 await 쓰고싶을 수 있으니.)
    return this.postsRepository.find({
      relations: ['author']
    });
  }

  async getPostById(id: number) {
    // id값을 찾아 반환하기.
    const post = await this.postsRepository.findOne(
      {
        where: {
          id,
        },
        relations: ['author']
      }
    );
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async createPost(authorId: number, title: string, content: string) {
    // create => 저장할 객체를 생성한다.
    // save => 객체를 저장한다. (create 매서드에서 생성한 객체로)
    // 이를 조합해서 진행하자!
    const post = this.postsRepository.create({
      author:{
        id: authorId,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(id: number, title?:string, content?:string) {
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
      }
    });
    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(id);
    return id;
  }
}