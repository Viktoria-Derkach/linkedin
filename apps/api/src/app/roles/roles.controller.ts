import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDto } from '../dtos/role.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesService } from './roles.service';

@UseGuards(AuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() role: CreateRoleDto) {
    try {
      return this.rolesService.createRole(role);
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      }
      console.error(e);
    }
  }
}
