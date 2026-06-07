import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
