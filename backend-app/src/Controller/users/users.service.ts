import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEmailDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Address) private AddressRepository: Repository<Address>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { Email: createUserDto.Email },
    });
    if (user) {
      return new HttpException('Email en uso', HttpStatus.CONFLICT);
    }

    const newAddress = await this.AddressRepository.save(createUserDto.Address);
    createUserDto.Address = newAddress;
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { UserId: id } });
    if (!user) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { Email: email } });
    if (!user) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async updateEmail(email: string, updateUserEmailDto: UpdateUserEmailDto) {
    const user = await this.userRepository.findOne({ where: { Email: email } });
    if (!user) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.update({ Email: email }, updateUserEmailDto);
  }

  async remove(id: number) {
    const deleteResult = await this.userRepository.delete({ UserId: id });
    if (!deleteResult) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return deleteResult;
  }
}
