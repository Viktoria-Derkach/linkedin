import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [UserModule, JwtModule.registerAsync(getJWTConfig()), MailModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
