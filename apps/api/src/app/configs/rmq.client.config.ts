import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';

export const getRMQClientConfig = (): ClientsProviderAsyncOptions => ({
  name: 'linkedin',
  useFactory: async (configService: ConfigService) => ({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RMQ_URL')],
      queue: configService.get<string>('RMQ_QUEUE'),
    },
  }),
  inject: [ConfigService],
});
