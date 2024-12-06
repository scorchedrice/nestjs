import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PostModel} from "./post.entity";

@Entity()
export class TagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => PostModel, post => post.tags)
  posts: PostModel[];

  @Column()
  name: string;
}