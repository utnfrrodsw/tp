import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../Controller/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Cambia por tu clave secreta
      signOptions: { expiresIn: '1h' }, // Opcional: expira en 1 hora
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
