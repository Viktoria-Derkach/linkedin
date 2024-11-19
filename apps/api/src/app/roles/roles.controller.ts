import { Body, Controller, Post } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() role: CreateRoleDto) {
    console.log(role, 'role');

    return this.rolesService.createRole(role);
  }
}
