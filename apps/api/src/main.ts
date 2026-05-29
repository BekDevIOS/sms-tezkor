import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter, LoggingInterceptor } from '@app/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable nested query objects, e.g. ?search[text]=foo&search[status]=ACTIVE
  app.getHttpAdapter().getInstance().set('query parser', 'extended');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({ origin: true, credentials: true });

  const port = process.env.PORT ?? 4009;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
