import {
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

@Controller('auth')
export class AuthController {
  // constructor(private readonly rmqService: RMQService) {}
  constructor(@Inject('linkedin') private readonly client: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {

      const record = new RmqRecordBuilder(dto)
        .setOptions({
          headers: {
            requestId: 'adad',
          },
          priority: 3,
        })
        .build();
      console.log(dto, record, 'in register api');

      // this.client.send(AccountRegister.topic, record).subscribe({
      //   next: (result) => console.log(result),
      //   error: (err) => console.error(err, 'fuck'),
      //   complete: () => console.log('Message sent'),
      // });
      this.client.emit(AccountRegister.topic, dto);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
      console.error(e);
    }

    // try {
    //   return await this.rmqService.send<
    //     AccountRegister.Request,
    //     AccountRegister.Response
    //   >(AccountRegister.topic, dto, { headers: { requestId: 'adad' } });
    // } catch (e) {
    //   if (e instanceof Error) {
    //     throw new UnauthorizedException(e.message);
    //   }
    // }
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    // try {
    //   return await this.rmqService.send<
    //     AccountLogin.Request,
    //     AccountLogin.Response
    //   >(AccountLogin.topic, dto);
    // } catch (e) {
    //   if (e instanceof Error) {
    //     throw new UnauthorizedException(e.message);
    //   }
    // }
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