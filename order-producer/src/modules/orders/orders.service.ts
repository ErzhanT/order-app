import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { KafkaService } from '../kafka/kafka.service';
import {
  OrderCancelMeta,
  OrderCreateMeta,
  OrderStatus,
  OrderUpdateMeta,
} from './types';
import { EventType } from '../kafka/types';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(order: Partial<Order>): Promise<Order> {
    const newOrder = this.ordersRepository.create({
      productId: order.productId,
      userId: order.userId,
      count: order.count,
    });
    await this.ordersRepository.save(newOrder);

    await this.kafkaService.produceOrder<OrderCreateMeta>({
      orderId: newOrder.id,
      type: EventType.CREATE,
      metadata: {
        productId: newOrder.productId,
        status: OrderStatus.pending,
        userId: newOrder.userId,
      },
    });

    return newOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findAllByUserId(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({ where: { userId } });
  }

  async findOne(id: string): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updatedOrder: Partial<Order>): Promise<Order> {
    const order = await this.ordersRepository.save(
      { ...updatedOrder, id },
      { reload: true },
    );
    await this.kafkaService.produceOrder<OrderUpdateMeta>({
      orderId: order.id,
      type: EventType.UPDATE,
      metadata: {
        status: order.status,
        count: order.count,
      },
    });

    return order;
  }

  async remove(id: string, reason: string): Promise<void> {
    await this.ordersRepository.save({ id, status: OrderStatus.cancelled });
    await this.kafkaService.produceOrder<OrderCancelMeta>({
      orderId: id,
      type: EventType.CANCEL,
      metadata: { reason },
    });
  }
}
