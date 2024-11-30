// 여기에 post 관련 모델 생성, sql문 대체

import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PostsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}