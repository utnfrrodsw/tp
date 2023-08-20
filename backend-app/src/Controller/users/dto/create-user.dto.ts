import { IsEmail, IsNotEmpty } from 'class-validator';
import { Roles } from '../entities/user.entity';
import { CreateAddressDto } from 'src/Controller/users/dto/create-address.dto';

export class CreateUserDto {
  @IsNotEmpty()
  FirstName: string;

  @IsNotEmpty()
  LastName: string;

  @IsEmail()
  Email: string;

  @IsNotEmpty()
  Password: string;

  Role?: Roles;

  Address: CreateAddressDto;
}
