import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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
  author_id: number;

  @CreateDateColumn()
  created_at: Date;
}
