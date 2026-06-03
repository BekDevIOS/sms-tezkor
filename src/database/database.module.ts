import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('NODE_ENV') === 'production'
            ? configService.get<string>('MONGO_PROD')
            : configService.get<string>('MONGO_DEV'),
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectConnection() connection: Connection) {
    const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    if (connection.readyState === 1) {
      this.logger.log(`MongoDB connected (${env})`);
    } else {
      this.logger.error('MongoDB is NOT connected!');
    }
  }
}
