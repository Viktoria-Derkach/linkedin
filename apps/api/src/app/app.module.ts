import { Module } from '@nestjs/common';


import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from './configs/rmq.config';
import { getJWTConfig } from './configs/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AuthController, UserController],
})
export class AppModule {}
