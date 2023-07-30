import { Address } from './address.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
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

  @OneToOne(() => Address, (address) => address.user, { cascade: true })
  @JoinColumn()
  Address: Address;
}
