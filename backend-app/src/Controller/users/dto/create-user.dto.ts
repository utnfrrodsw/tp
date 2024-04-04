import { IsEmail, IsNotEmpty } from 'class-validator';
import { Roles } from '../entities/user.entity';
import { CreateAddressDto } from 'src/Controller/users/dto/create-address.dto';
import { Status } from '../entities/status';

export class CreateUserDto extends Status {
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
