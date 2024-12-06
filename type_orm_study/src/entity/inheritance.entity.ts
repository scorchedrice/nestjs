import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn
} from "typeorm";

export class BaseModel{
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class BookModel extends BaseModel{
  @Column()
  name: string
}

@Entity()
export class CarModel extends BaseModel{
  @Column()
  brand: string;
}

// 아래는 굳이 쓸 필요는 없을 듯함.
@Entity()
@TableInheritance({
  column: {
    name: 'type',
    type: 'varchar',
  }
})
export class SingleBaseModel{
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@ChildEntity('computer')
export class ComputerModel extends SingleBaseModel{
  @Column()
  brand: string;
}

@ChildEntity('airplane')
export class AirPlaneModel extends SingleBaseModel{
  @Column()
  brand: string;
}