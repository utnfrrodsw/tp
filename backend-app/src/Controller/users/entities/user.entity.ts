import { hash } from 'bcrypt';
import { Address } from './address.entity';
import {
  BeforeInsert,
  BeforeUpdate,
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

  @Column()
  Password: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  async hasPassword() {
    if (!this.Password) return;
    this.Password = await hash(this.Password, 10);
  }
}
