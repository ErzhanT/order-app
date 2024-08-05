import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { OrderEventType } from './types';

@Entity()
export class OrderEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  external_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ enum: OrderEventType })
  type: OrderEventType;

  @Column({ type: 'jsonb' })
  metadata: Record<string, string>;
}
