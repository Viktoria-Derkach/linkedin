import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => {
      const uri = getMongoString(configService);
      console.log(uri, 'urillllll');

      return {
        uri,
      };
    },
    inject: [ConfigService],
    imports: [ConfigModule],
  };
}

const getMongoString = (configService: ConfigService) =>
	'mongodb://' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_DATABASE')
