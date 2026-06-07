import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@ApiTags('Addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user addresses' })
  async findAll(@Request() req: any) {
    return this.addressesService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  async findOne(@Request() req: any, @Param('id') id: number) {
    return this.addressesService.findById(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  async create(@Request() req: any, @Body() createDto: CreateAddressDto) {
    return this.addressesService.create(req.user.id, createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  async update(
    @Request() req: any,
    @Param('id') id: number,
    @Body() updateDto: UpdateAddressDto
  ) {
    return this.addressesService.update(id, req.user.id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  async delete(@Request() req: any, @Param('id') id: number) {
    return this.addressesService.delete(id, req.user.id);
  }
}
