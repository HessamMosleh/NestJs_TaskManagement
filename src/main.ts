import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './utils/errorFilter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  // app.useGlobalFilters(new ErrorFilter());
  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`Application liston on port: ${port}`);
}

bootstrap();
