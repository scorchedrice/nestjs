// 여기에 post 관련 모델 생성, sql문 대체

import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersModel} from "../../users/entity/users.entity";

@Entity()
export class PostsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}