import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'The number of products in the order' })
  count: number;

  @ApiProperty({ description: 'The ID of the user who placed the order' })
  userId: string;

  @ApiProperty({ description: 'The ID of the product in the order' })
  productId: string;
}
