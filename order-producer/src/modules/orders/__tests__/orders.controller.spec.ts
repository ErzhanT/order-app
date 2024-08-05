import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { Order } from '../entities/order.entity';
import { v4 as uuidV4 } from 'uuid';

import { KafkaModule } from '../../kafka/kafka.module';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order', async () => {
    const orderDto = {
      count: 10,
      userId: uuidV4(),
      productId: uuidV4(),
    };
    const createdOrder = {
      ...orderDto,
    } as Order;

    jest.spyOn(service, 'create').mockResolvedValue(createdOrder);

    expect(await controller.create(orderDto)).toBe(createdOrder);
  });

  it('should find all orders', async () => {
    const orders: Order[] = [];
    jest.spyOn(service, 'findAll').mockResolvedValue(orders);

    expect(await controller.findAll()).toBe(orders);
  });

  it('should find one order', async () => {
    const order = new Order();
    jest.spyOn(service, 'findOne').mockResolvedValue(order);

    expect(await controller.findOne('1')).toBe(order);
  });

  it('should update an order', async () => {
    const order = new Order();
    jest.spyOn(service, 'update').mockResolvedValue(order);

    expect(await controller.update('1', order)).toBe(order);
  });

  it('should remove an order', async () => {
    const id = uuidV4();
    const reason = 'Cancelled by user';
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    await controller.remove(id, reason);

    expect(service.remove).toHaveBeenCalledWith(id, reason);
  });
});
