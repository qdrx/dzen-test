import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Comment, (comment) => comment.author_id)
  comments: Comment[];

  @Column({ unique: true })
  email: string;

  constructor(entity: Partial<User>) {
    Object.assign(this, entity);
  }
}
