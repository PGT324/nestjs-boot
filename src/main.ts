import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //cors
  app.enableCors();
  //validation pipe
  app.useGlobalPipes(new ValidationPipe());
  //exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  //이미지 업로드
  app.use(graphqlUploadExpress());
  await app.listen(3000);
}
bootstrap();
