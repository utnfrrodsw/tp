import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Roles {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  UserId: number;

  @Column()
  FirstName: string;

  @Column()
  LastName: string;

  @Column({ unique: true })
  Email: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  Role: Roles;

  @CreateDateColumn()
  CreatedAt: Date;
}
