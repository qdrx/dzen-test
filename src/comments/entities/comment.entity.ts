import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ default: null })
  attachment: string;

  @ManyToOne(() => User, (user) => user.comments)
  author: number | User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  replyTo: Comment;

  @OneToMany(() => Comment, (comment) => comment.replyTo)
  replies: Comment[];

  @CreateDateColumn()
  created_at: Date;
}
