import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../database/entities/address.entity';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepo: Repository<Address>
  ) {}

  async findByUser(userId: number) {
    return this.addressRepo.find({ where: { user_id: userId } });
  }

  async findById(id: number, userId: number) {
    const address = await this.addressRepo.findOne({
      where: { id, user_id: userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async create(userId: number, createDto: CreateAddressDto) {
    const address = this.addressRepo.create({
      ...createDto,
      user_id: userId,
    });
    return this.addressRepo.save(address);
  }

  async update(id: number, userId: number, updateDto: UpdateAddressDto) {
    const address = await this.findById(id, userId);
    Object.assign(address, updateDto);
    return this.addressRepo.save(address);
  }

  async delete(id: number, userId: number) {
    const address = await this.findById(id, userId);
    return this.addressRepo.remove(address);
  }
}
