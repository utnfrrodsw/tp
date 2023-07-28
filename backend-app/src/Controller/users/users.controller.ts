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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Observable, of } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
//@UseGuards(AuthGuard) //permite usar guard en todos los endpoints
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  //@SetMetadata('roles', ['admin'])
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @SetMetadata('roles', ['user', 'admin'])
  findAll(): Observable<string> {
    return of(this.usersService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
