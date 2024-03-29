import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationException } from './common/error/validation-exception.js';
import { AllExceptionsFilter } from './common/error/all-exceptions-filter.js';

async function bootstrap() {
  const hostIpAddress = process.env.HOST_IP ?? "127.0.0.1";
  const appListeningPort = process.env.APP_PORT ?? 3000;

  const serverUrlLocalhost = `http://localhost:${appListeningPort}`;
  const serverUrl = `http://${hostIpAddress}:${appListeningPort}`;

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('publiish-api')
    .setDescription('Description of Publiish API endpoints.')
    .setVersion('1.0')
    .addTag('publiish_api')
    // .addServer(serverUrlLocalhost)
    .addServer(serverUrl)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(appListeningPort);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
