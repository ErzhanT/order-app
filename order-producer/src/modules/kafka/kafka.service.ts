import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Admin, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

import { OrderEvent } from './types';

@Injectable()
export class KafkaService implements OnModuleInit, OnApplicationShutdown {
  private readonly kafka: Kafka;
  private readonly admin: Admin;
  private readonly producer: Producer;

  private readonly TOPIC_NAME = 'order_topic';

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'order-broker',
      brokers: [this.configService.get<string>('KAFKA_URL')],
    });
    this.admin = this.kafka.admin();
    this.producer = this.kafka.producer();
  }

  async onModuleInit(): Promise<void> {
    await this.initConnection();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.shutdownConnection();
  }

  async produceOrder<TMetadata>(event: OrderEvent<TMetadata>) {
    await this.producer.connect();

    await this.producer.send({
      topic: this.TOPIC_NAME,
      messages: [{ value: JSON.stringify(event) }],
    });

    await this.producer.disconnect();
  }

  private async initConnection() {
    await this.admin.connect();
    await this.producer.connect();

    const topics = await this.admin.listTopics();

    if (!topics.includes(this.TOPIC_NAME)) {
      await this.admin.createTopics({
        topics: [
          {
            topic: this.TOPIC_NAME,
            numPartitions: 1,
          },
        ],
      });
    }
  }

  private async shutdownConnection() {
    await this.admin.disconnect();
    await this.producer.disconnect();
  }
}
