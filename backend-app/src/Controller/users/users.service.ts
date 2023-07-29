import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEmailDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { UserId: id } });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { Email: email } });
  }

  updateEmail(email: string, updateUserEmailDto: UpdateUserEmailDto) {
    return this.userRepository.update({ Email: email }, updateUserEmailDto);
  }

  remove(id: number) {
    return this.userRepository.delete({ UserId: id });
  }
}
