import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @Column()
  @ApiProperty({ description: 'The name of the user' })
  name: string;

  @OneToMany(() => Order, (order) => order.user)
  @ApiProperty({ description: 'The orders placed by this user' })
  orders: Order[];
}
