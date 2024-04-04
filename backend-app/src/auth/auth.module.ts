import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/controller/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './auth.strategy';
import { JwtConstants } from './jwtConstants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: JwtConstants.secret,
      signOptions: { expiresIn: JwtConstants.expireTime },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
