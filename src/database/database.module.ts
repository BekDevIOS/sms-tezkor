import { Module } from '@nestjs/common';
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
  constructor(@InjectConnection() private readonly connection: Connection) {
    if (connection.readyState === 1) {
      console.log(
        `MongoDB is connected into ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} db`,
      );
    } else {
      console.log('DB is not connected!');
    }
  }
}
