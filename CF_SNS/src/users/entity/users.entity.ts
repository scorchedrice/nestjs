import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { RolesEnum } from "../const/roles.const";

// nickname, email은 unique
// nickname length <= 20


@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    unique: true,
  })
  nickname: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}