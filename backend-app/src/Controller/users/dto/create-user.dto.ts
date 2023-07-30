import { Roles } from '../entities/user.entity';
import { CreateAddressDto } from 'src/Controller/users/dto/create-address.dto';

export class CreateUserDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Role?: Roles;
  Address: CreateAddressDto;
}
