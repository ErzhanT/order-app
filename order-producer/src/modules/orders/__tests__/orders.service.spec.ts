import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { v4 as uuidV4 } from 'uuid';
import { Order } from '../entities/order.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { KafkaModule } from '../../kafka/kafka.module';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;
  let userRepository: Repository<User>;
  let kafkaClient: ClientKafka;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [KafkaModule],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: ClientKafka,
          useValue: {
            emit: jest.fn(),
            connect: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    kafkaClient = module.get<ClientKafka>(ClientKafka);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an order', async () => {
    const user = { id: uuidV4(), name: 'Test User' } as User;
    const product = {
      id: uuidV4(),
      name: 'Test Product',
      price: 100,
    } as Product;

    const order: Partial<Order> = {
      count: 10,
      userId: user.id,
      productId: product.id,
    };
    const createdOrder = {
      ...order,
      id: uuidV4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Order;

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
    jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
    jest.spyOn(orderRepository, 'create').mockReturnValue(createdOrder);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(createdOrder);
    jest.spyOn(kafkaClient, 'emit').mockImplementation(() => null);

    expect(await service.create(order)).toBe(createdOrder);
    expect(kafkaClient.emit).toHaveBeenCalledWith(
      'order_created',
      createdOrder,
    );
  });

  it('should find all orders', async () => {
    const orders: Order[] = [];
    jest.spyOn(orderRepository, 'find').mockResolvedValue(orders);
    expect(await service.findAll()).toBe(orders);
  });

  it('should find one order', async () => {
    const order = new Order();
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
    expect(await service.findOne('1')).toBe(order);
  });

  it('should update an order', async () => {
    const order = new Order();
    jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order);
    jest.spyOn(orderRepository, 'save').mockResolvedValue(order);
    jest.spyOn(kafkaClient, 'emit').mockImplementation(() => null);

    expect(await service.update('1', order)).toBe(order);
    expect(kafkaClient.emit).toHaveBeenCalledWith('order_updated', {
      orderId: order.id,
      type: 'UPDATE',
      metadata: {
        status: order.status,
        count: order.count,
      },
    });
  });

  it('should remove an order', async () => {
    const id = uuidV4();
    const reason = 'Cancelled by user';

    jest.spyOn(orderRepository, 'save').mockResolvedValue(undefined);
    jest.spyOn(kafkaClient, 'emit').mockImplementation(() => null);

    await service.remove(id, reason);

    expect(orderRepository.save).toHaveBeenCalledWith({ id });
    expect(kafkaClient.emit).toHaveBeenCalledWith('order_cancelled', {
      orderId: id,
      type: 'CANCEL',
      metadata: { reason },
    });
  });
});
