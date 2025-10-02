// typical Nest bootstrap:
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow the Next.js app to call this API during dev
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  });

  await app.listen(3002); // keep your existing port if different
}
bootstrap();

