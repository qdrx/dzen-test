import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @Column({ unique: true, select: false })
  email: string;
}
