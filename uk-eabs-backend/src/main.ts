import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { HttpExceptionFilter } from './shared/http-exception.filter';

async function bootstrap() {
  // NestJS Application
  // const httpsOptions = {
  //   key: fs.readFileSync(process.env.APP_SSL_PRIVATE_KEY),
  //   cert: fs.readFileSync(process.env.APP_SSL_CERTIFICATE),
  // };
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(compression({}));
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: process.env.APP_CORS_WHITELIST });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  // Swagger Documentation Handler
  const options = new DocumentBuilder()
    .setTitle('Dave Scott Signs API Microservice')
    .setDescription('Estate and Letting Agency Board Management System API')
    .setVersion('0.1.0')
    .setContact('William Sousa', 'https://www.linkedin.com/in/wrs-dev/', 'wrs@sapo.pt')
    // .setLicense('Private License', 'http://scionlabs.io/private.license.md')
    .addTag('Authentication', '(v0.1) Endpoints related with authentication process.')
    .addTag('Users', '(v0.1) Endpoints related with all users.')
    .addTag('Boards', '(v0.1) Endpoints related with agency boards.')
    .addTag('Schedules', '(v0.1) Endpoints related with schedule work.')
    .addTag('Invoices', '(v0.1) Endpoints related with invoicing.')
    // .addCookieAuth('Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // Listening start
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
