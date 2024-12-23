import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleDto } from '../dtos/role.dto';
import { Role } from '../schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) {}

  async getRoleByName(roleName: string) {
    return this.RoleModel.findOne({ name: roleName });
  }

  async createRole(role: CreateRoleDto) {
    const existedRole = await this.getRoleByName(role.name);

    if (existedRole) {
      throw new BadRequestException('The role exists');
    }

    return this.RoleModel.create(role);
  }

  async getRoleById(roleId: string) {
    return this.RoleModel.findById(roleId);
  }
}
