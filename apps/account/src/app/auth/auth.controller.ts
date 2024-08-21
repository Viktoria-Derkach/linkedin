import { Body, Controller, Logger } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@linkedin/contracts';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @RMQValidate()
  // @RMQRoute(AccountRegister.topic)
  @MessagePattern(AccountRegister.topic)
  async register(
    @Payload() dto: AccountRegister.Request,
    @Ctx() context: RmqContext
  ): Promise<AccountRegister.Response> {
    const {
      properties: { headers },
    } = context.getMessage();
    const rid = headers['requestId'];

    const logger = new Logger(rid);
    logger.error('There was an error');
    return this.authService.register(dto);
  }

  // @RMQValidate()
  // @RMQRoute(AccountLogin.topic)
  @MessagePattern(AccountRegister.topic)
  async login(
    @Payload() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
