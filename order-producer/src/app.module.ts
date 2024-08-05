import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmConfigService } from './config/typeorm-config.service';
import { OrdersModule } from './modules/orders/orders.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { SeederModule } from './modules/seeder/seeder.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    OrdersModule,
    KafkaModule,
    SeederModule,
  ],
})
export class AppModule {}
