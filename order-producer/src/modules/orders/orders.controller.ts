import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Query,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'Returns all orders',
    type: [Order],
  })
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all orders by user ID' })
  @ApiParam({ name: 'userId', type: String, description: 'ID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all orders for a user',
    type: [Order],
  })
  findAllByUserId(@Param('userId') userId: string): Promise<Order[]> {
    return this.ordersService.findAllByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the order' })
  @ApiResponse({ status: 200, description: 'Returns the order', type: Order })
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ description: 'Order details', type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: Order,
  })
  create(@Body() order: Partial<Order>): Promise<Order> {
    return this.ordersService.create(order);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the order' })
  @ApiBody({ description: 'Updated order details', type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    type: Order,
  })
  update(
    @Param('id') id: string,
    @Body() order: Partial<Order>,
  ): Promise<Order> {
    return this.ordersService.update(id, order);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the order' })
  @ApiQuery({
    name: 'reason',
    type: String,
    description: 'Reason for cancellation',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
  remove(
    @Param('id') id: string,
    @Query('reason') reason: string,
  ): Promise<void> {
    return this.ordersService.remove(id, reason);
  }
}
