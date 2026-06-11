import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AddressesService } from '../addresses/addresses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin - Addresses')
@Controller('admin/addresses')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('access-token')
export class AdminAddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List addresses' })
  async list(@Query('page') page = '1', @Query('limit') limit = '50') {
    return this.addressesService.listAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address' })
  async get(@Param('id') id: string) {
    return this.addressesService.getById(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Create address' })
  async create(@Body() body: any) {
    return this.addressesService.createGlobal(body as any);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.addressesService.updateGlobal(Number(id), body as any);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  async delete(@Param('id') id: string) {
    return this.addressesService.deleteGlobal(Number(id));
  }
}
