import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controller/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankModule } from './controller/bank/bank.module';
import { AnotherInvestmentModule } from './controller/another-investment/another-investment.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    BankModule,
    AnotherInvestmentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('PORT');
  }
}
