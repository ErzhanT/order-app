import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { SeederModule } from '../seeder/seeder.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), KafkaModule, SeederModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
