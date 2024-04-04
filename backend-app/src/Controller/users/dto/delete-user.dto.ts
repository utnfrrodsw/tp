import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserDto {
  @IsNotEmpty()
  UserId: number;
}
