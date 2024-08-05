import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderEventService } from './order-event.service';
import { OrderEvent } from './order-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEvent])],
  providers: [OrderEventService],
  exports: [OrderEventService],
})
export class OrderEventModule {}
