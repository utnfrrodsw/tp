import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEmailDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { DeleteUserDto } from './dto/delete-user.dto';
import { State } from './entities/status';

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
      console.log(user);
      return new HttpException('Email en uso', HttpStatus.CONFLICT);
    }
    const newAddress = await this.AddressRepository.save(createUserDto.Address);
    createUserDto.Address = newAddress;
    createUserDto.State = State.ACTIVED;
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { State: State.ACTIVED } });
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

  async updateEmail(userId: number, updateUserEmailDto: UpdateUserEmailDto) {
    const user = await this.userRepository.findOne({
      where: { UserId: userId },
    });
    if (!user) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    user.Email = updateUserEmailDto.NewEmail;
    console.log(user);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const deleteResult = await this.userRepository.delete({ UserId: id });
    if (!deleteResult) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return deleteResult;
  }

  async delete(deleteUserDto: DeleteUserDto) {
    const userId = deleteUserDto.UserId;
    const user = await this.userRepository.findOne({
      where: { UserId: userId },
    });
    if (!user) {
      return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    user.State = State.DELETED;
    await this.userRepository.update(user.UserId, {
      State: user.State,
    });

    const test = await this.userRepository.findOneOrFail({
      where: { UserId: user.UserId },
    });
    return test;
  }
}
