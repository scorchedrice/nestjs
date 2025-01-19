// 여기에 post 관련 모델 생성, sql문 대체

import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UsersModel} from "../../users/entity/users.entity";
import {BaseModel} from "../../common/entity/base.entity";
import {IsString} from "class-validator";

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: 'title은 string을 받아야합니다.'
  })
  title: string;

  @Column()
  @IsString({
    message: 'content는 string을 받아야합니다.'
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}