import { UsersService } from 'src/controller/users/users.service';
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserLogIn } from './userLogIn.model';
import { User } from 'src/controller/users/entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (
      user &&
      'Password' in user &&
      (await bcrypt.compare(password, user.Password))
    ) {
      const { Password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserLogIn) {
    const foundUser: User | HttpException =
      await this.usersService.findUserByEmail(user.username);

    if ((foundUser as User).Email == undefined)
      throw new NotFoundException('Credenciales inválidas');
    const payload = {
      username: (foundUser as User).Email,
      firstname: (foundUser as User).FirstName,
      lastname: (foundUser as User).LastName,
      rol: (foundUser as User).Role,
    };
    const token = await this.jwtService.signAsync(payload);
    const hasPass = (foundUser as User).Password;
    const isOk = await bcrypt.compare(user.password, hasPass);

    if (isOk) {
      console.log('ok return', token);
      return {
        access_token: token,
      };
    } else return { error: 'error en el hash' };
  }
}
