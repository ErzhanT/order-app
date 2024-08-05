import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../types';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the order' })
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @ApiProperty({ description: 'The date the order was created' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @ApiProperty({ description: 'The date the order was last updated' })
  updatedAt: Date;

  @Column()
  @ApiProperty({ description: 'The number of products in the order' })
  count: number;

  @Column({ enum: OrderStatus, default: OrderStatus.pending })
  @ApiProperty({ enum: OrderStatus, description: 'The status of the order' })
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'The user who placed the order' })
  user: User;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'The ID of the user who placed the order' })
  userId: string;

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'productId' })
  @ApiProperty({ description: 'The product in the order' })
  product: Product;

  @Column({ type: 'uuid' })
  @ApiProperty({ description: 'The ID of the product in the order' })
  productId: string;
}
