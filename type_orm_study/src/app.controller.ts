import {Controller, Get, Param, Patch, Post} from '@nestjs/common';
import {Repository} from "typeorm";
import {Role, UserModel} from "./entity/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ProfileModel} from "./entity/profile.entity";
import {PostModel} from "./entity/post.entity";
import {TagModel} from "./entity/tag.entity";

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,

    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,

    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,

    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  // @Post('users')
  // postUser() {
  //   return this.userRepository.save(
  //     {
  //       title: 'test',
  //       // role: Role.ADMIN,
  //     }
  //   )
  // }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      relations: {
        profile: true,
        posts: true,
      }
    });
  }

  @Patch('users/:id')
  async PatchUser(
    @Param('id') id: string,) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      }
    });

    return this.userRepository.save({
      ...user,
    });
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'testmail@gmail.com'
    })

    const profile = await this.profileRepository.save({
      profileImg: 'abc.jpg',
      user,
    })
    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'mkmkmk@gmail.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'post1'
    })

    await this.postRepository.save({
      author: user,
      title: 'post2'
    })
    return user;
  }

  @Post('posts/tags')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'tag test 1'
    })
    const post2= await this.postRepository.save({
      title: 'tag test 2'
    })

    const tag1 = await this.tagRepository.save({
      name: 'tag 1',
      posts: [post1, post2]
    })

    const tag2 = await this.tagRepository.save({
      name: 'tag 2',
      posts: [post1]
    })

    const post3 = await this.postRepository.save({
      title: 'post 3',
      tags: [tag1, tag2],
    })

    return true
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      }
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      }
    })
  }
}
