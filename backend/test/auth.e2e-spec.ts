import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

const createTestOrmOptions = () => ({
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'globalmart_test',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
});

describe('Auth e2e', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [TypeOrmModule.forRoot(createTestOrmOptions()), AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    // optionally clear DB here using DataSource from module
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register -> 201', async () => {
    const res = await request(server)
      .post('/auth/register')
      .send({ email: 'e2e@test.com', password: 'test123' })
      .expect(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
  });

  it('POST /auth/login -> 201', async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({ email: 'e2e@test.com', password: 'test123' })
      .expect(201);
    expect(res.body).toHaveProperty('access_token');
  });
});
