import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('APP for encrypt and decrypt')
    .setDescription('Call me to encrypt or decrypt')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const appPort = process.env.PORT || 3000;
  await app.listen(appPort);

  console.log(`Run: http://localhost:${appPort}/`);
  console.log(`Run swagger: http://localhost:${appPort}/doc/`);
}
bootstrap();
