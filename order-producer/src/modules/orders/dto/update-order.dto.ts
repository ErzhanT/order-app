import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../types';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'The number of products in the order',
    required: false,
  })
  count?: number;

  @ApiProperty({
    description: 'The status of the order',
    required: false,
    enum: OrderStatus,
  })
  status?: OrderStatus;
}
