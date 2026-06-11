import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async list() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.usersService.findById(Number(id));
  }

  @Post()
  async create(@Body() body: any) {
    return this.usersService.createUser(body);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    return this.usersService.updateUser(Number(id), body);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const u = await this.usersService.findById(Number(id));
    if (!u) return { ok: false };
    await this.usersService.deleteUser(Number(id));
    return { ok: true };
  }
}
