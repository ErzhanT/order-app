import { Module } from '@nestjs/common';

import { KafkaService } from './kafka.service';
import { OrderEventModule } from '../order-event/order-event.module';

@Module({
  imports: [OrderEventModule],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
