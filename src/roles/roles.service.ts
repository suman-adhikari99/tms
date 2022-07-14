import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  async getAllRoles() {
    const roles = this.roleRepository.find();
    return roles;
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const checkRole = await this.roleRepository.findOne({
      role: createRoleDto.role,
    });

    if (checkRole) {
      throw new ConflictException('Role already exists');
    }

    const role = await this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }
}
