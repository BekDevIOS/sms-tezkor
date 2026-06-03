import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Liveness/readiness probe for Docker healthcheck and the reverse proxy.
   * readyState 1 = connected. Returns 200 only when the DB is reachable.
   */
  @Get('health')
  health() {
    const dbUp = this.connection.readyState === 1;
    return {
      status: dbUp ? 'ok' : 'degraded',
      db: dbUp ? 'up' : 'down',
      uptime: Math.floor(process.uptime()),
    };
  }
}
