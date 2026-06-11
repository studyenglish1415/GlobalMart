import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { join } from 'path';
// AdminJS imports are required at runtime to avoid TS/ESM resolution issues
// We'll load them dynamically so the compiled CommonJS code runs correctly.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Set global prefix
  const apiPrefix = process.env.API_PREFIX || '/api';
  app.setGlobalPrefix(apiPrefix);

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('GlobalMart E-Commerce API')
    .setDescription('API documentation for GlobalMart e-commerce platform')
    .setVersion(process.env.API_VERSION || '1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token'
    )
    .addTag('Authentication')
    .addTag('Products')
    .addTag('Cart')
    .addTag('Orders')
    .addTag('Reviews')
    .addTag('Users')
    .addTag('Admin')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve custom admin static UI from `public/admin` at /admin
  try {
    const expressStatic = require('express').static;
    const adminStaticPath = join(__dirname, '..', 'public', 'admin');
    (app as any).use('/admin', expressStatic(adminStaticPath));
    console.log(`📁 Serving admin UI from ${adminStaticPath} at /admin`);
  } catch (err) {
    console.warn('Failed to mount admin static assets:', err && err.message ? err.message : err);
  }
  // Serve uploaded files
  try {
    const expressStatic = require('express').static;
    const uploadsPath = join(__dirname, '..', 'public', 'uploads');
    (app as any).use('/uploads', expressStatic(uploadsPath));
    console.log(`📁 Serving uploads from ${uploadsPath} at /uploads`);
  } catch (err) {
    console.warn('Failed to mount uploads static assets:', err && err.message ? err.message : err);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📚 Swagger API docs: http://localhost:${port}/api`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
