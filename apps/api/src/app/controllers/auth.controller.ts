import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountChangeProfile,
  AccountLogin,
  AccountRegister,
} from '@linkedin/contracts';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ChangeInfoDto } from '../dtos/change-info.dto';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Controller('auth')
export class AuthController {
  // constructor(private readonly rmqService: RMQService) {}
  constructor(@Inject('linkedin') private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      return this.client
        .send({ cmd: AccountRegister.topic }, dto)
        .pipe(timeout(5000));
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
      console.error(e);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      return this.client
        .send({ cmd: AccountLogin.topic }, dto)
        .pipe(timeout(5000));
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Patch('change-info/:id')
  async changeInfo(@Param('id') id: string, @Body() dto: ChangeInfoDto) {
    // try {
    //   return await this.rmqService.send<
    //     AccountChangeProfile.Request,
    //     AccountChangeProfile.Response
    //   >(AccountChangeProfile.topic, { user: { ...dto }, id });
    // } catch (e) {
    //   if (e instanceof Error) {
    //     throw new UnauthorizedException(e.message);
    //   }
    // }
  }
}
