import {
  AccountChangePassword,
  AccountForgotPassword,
  AccountLogin,
  AccountRefreshToken,
  AccountRegister,
  AccountResetPassword,
} from '@linkedin/contracts';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { ChangeInfoDto } from '../dtos/change-info.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-tokens.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  // constructor(private readonly rmqService: RMQService) {}
  constructor(
    private readonly authService: AuthService,
    @Inject('linkedin') private readonly client: ClientProxy
  ) {}

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

  @Post('refresh')
  async refreshTokens(@Body() dto: RefreshTokenDto) {
    try {
      return this.client
        .send({ cmd: AccountRefreshToken.topic }, dto)
        .pipe(timeout(5000));
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(@Body() dto: ChangePasswordDto, @Req() req) {
    try {
      return this.client
        .send(
          { cmd: AccountChangePassword.topic },
          { ...dto, userId: req.userId }
        )
        .pipe(timeout(5000));
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    try {
      return this.client
        .send({ cmd: AccountForgotPassword.topic }, dto)
        .pipe(timeout(5000));
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      return this.client
        .send({ cmd: AccountResetPassword.topic }, dto)
        .pipe(timeout(5000));
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
    }
  }

  @UseGuards(AuthGuard)
  @Get('get-user')
  async getUser(@Req() req) {
    try {
      console.log(req.userId);

      return await this.authService.getUserPermissions(req.userId);
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
