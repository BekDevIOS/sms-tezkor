import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: process.env.MONGO_URI,
			}),
		}),
	],
	exports: [MongooseModule],
})
export class DatabaseModule {
	constructor(@InjectConnection() private readonly connection: Connection) {
		if (connection.readyState === 1) {
			console.log(
				`MongoDB is connected into ${process.env.NODE_ENV === 'prodcution' ? 'prodcution' : 'development'} db`,
			);
		} else {
			console.log('DB is not connected!');
		}
	}
}
