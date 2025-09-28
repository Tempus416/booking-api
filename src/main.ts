import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow your Next.js app on 3001 to call the API
  app.enableCors({ origin: ['http://localhost:3001'], credentials: true });

  // listen on PORT if set, otherwise 3002
  const port = Number(process.env.PORT ?? 3002);
  await app.listen(port);
  console.log(`API listening at http://localhost:${port}`);
}
bootstrap();
