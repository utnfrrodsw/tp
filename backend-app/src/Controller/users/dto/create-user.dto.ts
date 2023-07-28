import { Roles } from '../entities/user.entity';

export class CreateUserDto {
  FirstName: string;
  LastName: string;
  Email: string;
  Role?: Roles;
}
