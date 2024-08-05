import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the product' })
  id: string;

  @Column()
  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @Column('decimal')
  @ApiProperty({ description: 'The price of the product' })
  price: number;

  @OneToMany(() => Order, (order) => order.product)
  @ApiProperty({ description: 'The orders that contain this product' })
  orders: Order[];
}
