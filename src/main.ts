import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger(`main.ts`);
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    logger.log(`New request ${req.method} from ${req.get('host')}${req.url}`);
    next();
  });
  app.use(cookieParser('secret'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://tms.axiossoftwork.com',
      'https://qa.edfluent.axiossoftwork.com',
      'https://demo.edfluent.jp',
      'https://qa.tms.axiossoftworks.com',
      'https://uat.edfluent.axiossoftwork.com',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000; // port number
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();

// app.enableCors({
//   origin: [
//     'http://localhost:3000',
//     'http://localhost:3001',
//     'https://tms.axiossoftwork.com',
//     'https://qa.edfluent.axiossoftwork.com',
//     'https://demo.edfluent.jp',
//   ],
//   credentials: true,
// });
