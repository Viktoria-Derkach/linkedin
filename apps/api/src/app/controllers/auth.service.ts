import { Inject, Injectable } from '@nestjs/common';

import { AccountGetUser } from '@linkedin/contracts';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('linkedin') private readonly client: ClientProxy,
    private rolesService: RolesService
  ) {}

  async getUserPermissions(userId: string) {
    const source$ = this.client
      .send({ cmd: AccountGetUser.topic }, { userId })
      .pipe(timeout(5000));
    //   const user = await this.UserModel.findById(userId);

    //   if (!user) throw new BadRequestException();

    const user = await lastValueFrom(source$);

    console.log(user, 'user');

    const role = await this.rolesService.getRoleById(user.roleId?.toString());
    return role.permissions;

    // return [];
  }
}
