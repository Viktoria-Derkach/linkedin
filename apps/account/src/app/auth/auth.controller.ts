import {
  AccountChangePassword,
  AccountForgotPassword,
  AccountGetUser,
  AccountLogin,
  AccountRefreshToken,
  AccountRegister,
  AccountResetPassword,
} from '@linkedin/contracts';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';

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

  @MessagePattern({ cmd: AccountChangePassword.topic })
  async changePassword(
    @Payload()
    { userId, oldPassword, newPassword }: AccountChangePassword.Request
  ) {
    return this.authService.changePassword(userId, oldPassword, newPassword);
  }

  @MessagePattern({ cmd: AccountForgotPassword.topic })
  async forgotPassword(
    @Payload()
    { email }: AccountForgotPassword.Request
  ) {
    return this.authService.forgotPassword(email);
  }

  @MessagePattern({ cmd: AccountResetPassword.topic })
  async resetPassword(
    @Payload()
    { resetToken, newPassword }: AccountResetPassword.Request
  ) {
    return this.authService.resetPassword(resetToken, newPassword);
  }

  @MessagePattern({ cmd: AccountGetUser.topic })
  async getUser(
    @Payload()
    { userId }: AccountGetUser.Request
  ): Promise<AccountGetUser.Response> {
    console.log(userId, 'userId from account');

    return this.authService.getUser(userId);
  }
}
