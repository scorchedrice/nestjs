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

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    // find() 실행할 때 항상 같이 가져올 relation
    // 즉, controller에서 relation을 정의하지 않아도 relation 설정을 하고 가져온단 말임.
    eager: false,
    // 저장할 때 relation을 한번에 같이 저장 가능
    cascade: true,
    // null이 가능한지
    nullable: true,
    // 관계가 삭제되었을 때
    // no action => 아무것도 안함
    // CASCADE =>  참조하는 row도 같이 삭제
    // SET NULl => 참조 id를 null값으로
    // SET DEFAULT => 기본 세팅으로 변경 (테이블의 기본 세팅)
    // RESTRICT => 참조하고 있는 row가 있는 경우 참조당하는 row 삭제 불가
    onDelete: 'CASCADE'
  })
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel;

  @Column({
    default: 0,
  })
  numb: number;
}