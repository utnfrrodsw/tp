import { UsersService } from 'src/controller/users/users.service';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/controller/users/entities/user.entity';

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

  async login(user: User) {
    const payload = { username: user.FirstName, sub: user.UserId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
