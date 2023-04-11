import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationException } from './common/error/validation-exception';
import { AllExceptionsFilter } from './common/error/all-exceptions-filter';

async function bootstrap() {
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
    .addServer('http://localhost:3000')
    .addServer('http://18.118.187.243:3000')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, swaggerDocument);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
