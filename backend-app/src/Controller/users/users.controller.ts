import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEmailDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
//@UseGuards(AuthGuard) //permite usar guard en todos los endpoints
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  //@SetMetadata('roles', ['admin'])
  @UseGuards(AuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  //@SetMetadata('roles', ['user', 'admin'])
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User | HttpException> {
    return await this.usersService.findOne(id);
  }

  @Get('GetByEmail/:Email')
  async findOneByEmail(
    @Param('Email') Email: string,
  ): Promise<User | HttpException> {
    return await this.usersService.findUserByEmail(Email);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserEmailDto,
  ): Promise<User | HttpException> {
    return this.usersService.updateEmail(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<DeleteResult | HttpException> {
    return await this.usersService.remove(id);
  }

  @Post('delete')
  async logicDelete(
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<any | HttpException> {
    return this.usersService.delete(deleteUserDto);
  }
}
