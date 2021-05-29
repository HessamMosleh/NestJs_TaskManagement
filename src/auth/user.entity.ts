import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { compare } from 'bcrypt';
import { TaskEntity } from '../tasks/task.entity';

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'user',
}

@Entity()
@Unique(['username'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  // @Column({
  //   type: 'enum',
  //   enum: UserRole,
  //   default: UserRole.USER,
  // })
  // roles: UserRole;

  @Column({
    type: 'simple-array',
    default: UserRole.USER,
  })
  roles: UserRole;

  @OneToMany((type) => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  async isCorrectPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}
