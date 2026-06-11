import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('GlobalMart API')
    .setDescription('GlobalMart e-commerce API documentation')
    .setVersion('2.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outPath = path.resolve(__dirname, '..', 'swagger.json');
  fs.writeFileSync(outPath, JSON.stringify(document, null, 2), { encoding: 'utf8' });
  // also write YAML if js-yaml is available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const yaml = require('js-yaml');
    const outYaml = path.resolve(__dirname, '..', 'swagger.yaml');
    fs.writeFileSync(outYaml, yaml.dump(document), { encoding: 'utf8' });
  } catch (err) {
    // js-yaml not installed — skip YAML output
  }

  await app.close();
  console.log('Swagger JSON generated at', outPath);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
