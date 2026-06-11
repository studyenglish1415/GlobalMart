import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async createUser(data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): Promise<any> {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.usersRepo.create({
      email: data.email,
      password_hash: hashed,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
    } as any);
    return this.usersRepo.save(user);
  }

  async updateUser(id: number, data: Partial<User>) {
    await this.usersRepo.update(id, data as any);
    return this.usersRepo.findOne({ where: { id } });
  }

  async deleteUser(id: number) {
    return this.usersRepo.delete({ id });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }
}
