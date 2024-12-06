import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable} from "typeorm";
import {UserModel} from "./user.entity";
import {TagModel} from "./tag.entity";

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  // Post 들과 작성자 연결 (Many와 One의 연결)
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @ManyToMany(() => TagModel, (tag) => tag.posts)
  @JoinTable()
  tags: TagModel[];

  @Column()
  title: string;
}