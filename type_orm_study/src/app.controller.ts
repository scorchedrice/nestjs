import {Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {
  Between,
  Equal,
  ILike, In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository
} from "typeorm";
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

  @Post('users')
  async postUser() {
    for (let i = 0; i< 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@gmail.com`
      })
    }
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      order: {
        id: 'ASC'
      },
      where: {
        // 1이 아닌 경우를 가져오기
        // id: Not(1),
        // 미만이하이상초과
        // id: LessThan(20),
        // id: LessThanOrEqual(20),
        // id: MoreThanOrEqual(20),
        // id: MoreThan(20),
        // id: Equal(20),

        // 유사값
        // email: Like('%0%')
        // 유사값 - 대소문자 구별 x
        // email: ILike('%GMail%')
        // 사이값
        // id: Between(10, 15)
        // 해당되는 여러개의 값
        // id: In([1,3,5,7])
        // null인 경우를 가져옴
        // id: IsNull()
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

  // cascade true인 경우..
  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'testmail@gmail.com',
      profile: {
        profileImg: 'abc.jpg'
      }
    })

    // const profile = await this.profileRepository.save({
    //   profileImg: 'abc.jpg',
    //   user,
    // })
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

  @Delete('user/profile/:id')
  async deleteProfile(
    @Param('id') id: string
  ){
    await this.profileRepository.delete(+id);
  }

  @Post('sample')
  async sample() {
    // 객체만생성 (저장 x)
    // save의 경우 객체를 생성하고 저장하는 것까지 진행함.
    const user1 = this.userRepository.create({
      email: 'testmail@gmail.com',
    });

    // preload
    // 입력된 값을 기반으로 DB에 있는 데이터들을 불러옴
    // 추가 입력된 값으로 DB에서 가져온 값들을 대체함
    // 저장하진 않음.
    // find + create 정도로 이해
    const user2 = await this.userRepository.preload({
      id: 100,
      email: 'preload@gmail.com',
    })
    // 해당 아이디 제거
    // await this.userRepository.delete({
    //   id: 2,
    // })
    // return user2

    // 숫자 값을 올리기
    // 어떤 조건에 해당하는 것의 'numb' Row를 1올리겠다!
    // 숫자 내리기는 decrement 사용
    // await this.userRepository.increment({
    //   id: 1,
    // }, 'numb', 1)

    // 개수세기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%')
    //   }
    // })

    // 합 구하기
    // const sum = await this.userRepository.sum('numb', {
    //     email: ILike('%0%')
    // })
    // return sum

    // 평균 구하기
    // const average = await this.userRepository.average('numb', {
    //   id: LessThan(4)
    // })
    // return average

    // 최소값/최대값
    // const min = await this.userRepository.minimum('numb', {
    //   id: LessThan(4),
    // })
    // const max = await this.userRepository.maximum('numb', {
    //   id: LessThan(4),
    // })
    // return [min, max]

    // [가져온 목록, 갯수]를 가져옴
    // pagination에서 활용
    const userAndCount = await this.userRepository.findAndCount({
      take: 3,
    })
    // 3명의 유저 (take 조건) , user 전체인원 을 가져옴
    return userAndCount
  }
}
