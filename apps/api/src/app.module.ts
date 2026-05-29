import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/shared';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComponentModule } from './components/components.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ComponentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
