import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@linkedin/contracts';
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
  @EventPattern(AccountRegister.topic)
  async register(
    @Payload() data: AccountRegister.Request,
    @Ctx() context: RmqContext
  ): Promise<AccountRegister.Response> {
    console.log('Received DTO:', data);
    const {
      properties: { headers },
    } = context.getMessage();
    const rid = headers['requestId'];
    console.log(rid);

    // const logger = new Logger(rid);
    // logger.error('There was an error');
    if (data) {
      return this.authService.register(data);
    }
  }

  // @RMQValidate()
  // @RMQRoute(AccountLogin.topic)
  @MessagePattern(AccountLogin.topic)
  async login(
    @Payload() { email, password }: AccountLogin.Request
  ): Promise<AccountLogin.Response> {
    console.log('geee');

    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
