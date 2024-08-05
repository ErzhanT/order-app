import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

import { OrderEventService } from '../order-event/order-event.service';
import { OrderEventType } from '../order-event/types';

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  private readonly TOPIC_NAME = 'order_topic';

  constructor(
    private readonly orderEventService: OrderEventService,
    private configService: ConfigService,
  ) {
    this.kafka = new Kafka({
      clientId: 'order-broker',
      brokers: [this.configService.get<string>('KAFKA_URL')],
    });
    this.consumer = this.kafka.consumer({ groupId: 'order-consumer' });
  }

  async onModuleInit(): Promise<void> {
    await this.initConnection();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.shutdownConnection();
  }

  async consumeOrder(event: {
    type: OrderEventType;
    orderId: string;
    metadata: any;
  }) {
    await this.orderEventService.saveEvent({
      ...event,
      external_id: event.orderId,
    });
  }

  private async initConnection() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.TOPIC_NAME,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());

        await this.consumeOrder(event);
      },
    });
  }

  private async shutdownConnection() {
    await this.consumer.disconnect();
  }
}
