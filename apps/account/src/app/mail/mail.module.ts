import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { UserModule } from '../user/user.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
