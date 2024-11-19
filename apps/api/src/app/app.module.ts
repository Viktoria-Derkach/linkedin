import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { getJWTConfig } from './configs/jwt.config';
import { getMongoConfig } from './configs/mongo.config';
import { getRMQClientConfig } from './configs/rmq.client.config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './controllers/auth.service';
import { UserController } from './controllers/user.controller';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
    ClientsModule.registerAsync([getRMQClientConfig()]),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule,
    RolesModule,
    MongooseModule.forRootAsync(getMongoConfig()),
    ScheduleModule.forRoot(),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService],
})
export class AppModule {}
