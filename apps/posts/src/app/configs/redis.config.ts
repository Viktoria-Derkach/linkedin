import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export const getRedisConfig = () => ({
  imports: [ConfigModule],
  inject: [ConfigService],
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      ttl: 30 * 1000,
      socket: {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      },
    });

    return {
      store,
    };
  },
});
