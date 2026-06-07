import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../../database/entities/user-session.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserSession)
    private readonly sessionsRepo: Repository<UserSession>,
    private readonly configService: ConfigService
  ) {}

  async register(payload: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) throw new ConflictException('Email already in use');

    const user = await this.usersService.createUser(payload);
    const accessToken = this.signToken(user.id, user.email);
    const refreshToken = this.signRefreshToken(user.id, user.email);
    await this.createSession(user.id, refreshToken);
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, (user as any).password_hash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signToken(user.id, user.email);
    const refreshToken = this.signRefreshToken(user.id, user.email);
    await this.createSession(user.id, refreshToken);
    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }

  signRefreshToken(userId: number, email: string) {
    const payload = { sub: userId, email, type: 'refresh' };
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION') || '7d';
    return this.jwtService.sign(payload, { expiresIn });
  }

  private async createSession(userId: number, token: string) {
    const ttlSeconds = Number(
      this.configService.get('JWT_REFRESH_EXPIRATION_SECONDS') || 7 * 24 * 3600
    );
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
    const session = this.sessionsRepo.create({
      user_id: userId,
      token,
      expires_at: expiresAt,
    } as any);
    await this.sessionsRepo.save(session);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Missing refresh token');
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.sessionsRepo.findOne({ where: { token: refreshToken } });
    if (!session) throw new UnauthorizedException('Refresh token not found');
    if (session.expires_at < new Date()) {
      await this.sessionsRepo.delete({ id: session.id });
      throw new UnauthorizedException('Refresh token expired');
    }

    const userId = payload.sub;
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // rotate refresh token
    await this.sessionsRepo.delete({ id: session.id });
    const newRefresh = this.signRefreshToken(user.id, user.email);
    await this.createSession(user.id, newRefresh);
    const accessToken = this.signToken(user.id, user.email);
    return {
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name },
      access_token: accessToken,
      refresh_token: newRefresh,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Missing refresh token');
    await this.sessionsRepo.delete({ token: refreshToken });
    return { success: true };
  }

  async logoutAll(userId: number) {
    await this.sessionsRepo.delete({ user_id: userId });
    return { success: true };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const match = await bcrypt.compare(oldPassword, (user as any).password_hash);
    if (!match) throw new UnauthorizedException('Invalid current password');
    const hashed = await bcrypt.hash(newPassword, 10);
    await (this.usersService as any).updateUser(userId, { password_hash: hashed });
    // revoke all refresh tokens
    await this.logoutAll(userId);
    return { success: true };
  }
}
