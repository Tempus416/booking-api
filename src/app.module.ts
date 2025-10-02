import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { MeController } from './me.controller';
import { DebugController } from './debug.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <-- loads .env
    AuthModule,
  ],
  controllers: [AppController, MeController, DebugController],
  providers: [AppService],
})
export class AppModule {}
