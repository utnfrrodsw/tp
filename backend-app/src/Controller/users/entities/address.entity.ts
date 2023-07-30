import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  AddressId: number;

  @Column()
  Street: string;

  @Column()
  Number: string;

  @Column()
  City: string;

  @OneToOne(() => User, (user) => user.Address)
  @JoinColumn()
  user: User;
}
