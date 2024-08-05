import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TypeOrmConfigService } from './config/typeorm-config.service';
import { OrderEventModule } from './modules/order-event/order-event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    KafkaModule,
    OrderEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
