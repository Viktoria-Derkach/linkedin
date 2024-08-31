import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import {
  AccountLogin,
  AccountRefreshToken,
  AccountRegister,
} from '@linkedin/contracts';
import { AuthService } from './auth.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RmqRecord,
} from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @RMQValidate()
  // @RMQRoute(AccountRegister.topic)
  @MessagePattern({ cmd: AccountRegister.topic })
  async register(
    @Payload() data: AccountRegister.Request,
    @Ctx() context: RmqContext //
  ) {
    console.log('Received DTO:', data, context.getPattern());

    return this.authService.register(data);
  }

  @MessagePattern({ cmd: AccountLogin.topic })
  async login(@Payload() { email, password }: AccountLogin.Request) {
    const { id } = await this.authService.validateUser(email, password);
    const tokens = await this.authService.generateToken(id);
    return {
      ...tokens,
      userId: id,
    };
  }

  @MessagePattern({ cmd: AccountRefreshToken.topic })
  async refreshTokens(@Payload() { token }: AccountRefreshToken.Request) {
    return this.authService.refreshTokens(token);
  }
}
