import {
  Column,
  CreateDateColumn,
  Entity,
  Generated, OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import {ProfileModel} from "./profile.entity";
import {PostModel} from "./post.entity";

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // @PrimaryColumn()은 개인이 PK값을 직접 넣어줘야함.
  // @PrimaryGeneratedColumn('uuid') => 데이터가 생성될 때 마다 1씩 올라가는 것과 달리
  // 굉장히 복잡한 uuid로 생성한다는 의미
  @PrimaryGeneratedColumn()
  id: number;

 @Column()
 email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 업데이트가 몇번 되었는지 .. 업데이트 될 때 마다 1씩 올라감
  // 즉 save 될수록 숫자 하나씩 증가
  @VersionColumn()
  version: number;

  @Column()
  @Generated('uuid')
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel;
}