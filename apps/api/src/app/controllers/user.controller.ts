import { Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { Cron } from '@nestjs/schedule';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor() {}

  //  @UseGuards(JWTAuthGuard)
  @Post('info')
  async info(@UserId() userId: string) {}

  @Cron('* * * * */5 *')
  async cron() {
    Logger.log('Done');
  }

  @UseGuards(AuthGuard)
  @Post('some-method')
  async someMethod(@Req() req) {
    return {
      message: 'hi',
      userId: req.userId,
    };
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
