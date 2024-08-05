import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderEvent } from './order-event.entity';

@Injectable()
export class OrderEventService {
  constructor(
    @InjectRepository(OrderEvent)
    private readonly repository: Repository<OrderEvent>,
  ) {}

  async saveEvent(orderEvent: Partial<OrderEvent>) {
    return this.repository.save(orderEvent);
  }
}
