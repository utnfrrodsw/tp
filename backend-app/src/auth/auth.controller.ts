import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserLogIn } from './userLogIn.model';

@Controller('auth')
//@UseGuards(AuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: UserLogIn) {
    const result = await this.authService.login(req);
    return result;
  }
}
