import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// import { Resource } from '../enums/resource.enum';
import { Permissions } from '../decorators/permissions.decorator';
import { Action } from '../enums/action.enum';
import { Resource } from '../enums/resource.enum';
import { AuthGuard } from '../guards/auth.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('user')
export class UserController {
  constructor() {}

  @UseGuards(JWTAuthGuard)
  @Post('info')
  async info(@UserId() userId: string) {}

  // @Cron('* * */5 * * *')
  // async cron() {
  //   Logger.log('Done');
  // }

  @Permissions([
    { resource: Resource.products, actions: [Action.read, Action.create] },
    { resource: Resource.settings, actions: [Action.read] },
  ])
  @Get('some-method')
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
